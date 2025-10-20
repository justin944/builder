
import { useEffect, useRef } from 'react';

const useIframeCommunicator = () => {
  const ref = useRef(null);

  useEffect(() => {
    const postHeight = () => {
      if (ref.current) {
        const height = ref.current.scrollHeight;
        window.parent.postMessage({ type: 'resize', height }, '*');
      }
    };
    
    postHeight();

    const resizeObserver = new ResizeObserver(() => {
      postHeight();
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }
    
    window.addEventListener('resize', postHeight);

    const mutationObserver = new MutationObserver(postHeight);
    if(ref.current) {
      mutationObserver.observe(ref.current, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
      window.removeEventListener('resize', postHeight);
      mutationObserver.disconnect();
    };
  }, []);

  return ref;
};

export default useIframeCommunicator;

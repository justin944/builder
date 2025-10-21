
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
    
    const debouncedPostHeight = () => {
        requestAnimationFrame(postHeight);
    };

    debouncedPostHeight();

    const resizeObserver = new ResizeObserver(debouncedPostHeight);
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }
    
    window.addEventListener('resize', debouncedPostHeight);

    const mutationObserver = new MutationObserver(debouncedPostHeight);
    if(ref.current) {
      mutationObserver.observe(ref.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });
    }

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
      window.removeEventListener('resize', debouncedPostHeight);
      mutationObserver.disconnect();
    };
  }, []);

  return ref;
};

export default useIframeCommunicator;
  
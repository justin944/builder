
import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Draggable from 'react-draggable';

const CARD_FRONT_URL = "https://horizons-cdn.hostinger.com/4d273499-ee9a-4e0e-b198-a210ba5293ac/96fe08750da03d253d7670376ea49a9b.png";
const CARD_BACK_URL = "https://horizons-cdn.hostinger.com/4d273499-ee9a-4e0e-b198-a210ba5293ac/c9ff7406b72fe54db1c78182989fb4ec.png";
const CARD_WIDTH_INCHES = 2.5;
const CARD_HEIGHT_INCHES = 3.5;
const DPI = 300;
const CARD_WIDTH_PX = CARD_WIDTH_INCHES * DPI;
const CARD_HEIGHT_PX = CARD_HEIGHT_INCHES * DPI;
const DISPLAY_SCALE = 0.55;

const DraggableText = ({ element, onStop, onSelect, isSelected, scale }) => {
  const nodeRef = useRef(null);

  const handleStop = (e, data) => {
    onStop(element.id, { x: data.x, y: data.y });
  };
  
  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: element.position.x, y: element.position.y }}
      onStop={handleStop}
      scale={scale}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        onClick={() => onSelect(element)}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          fontFamily: element.fontFamily,
          fontSize: element.fontSize,
          color: element.color,
          cursor: 'move',
          padding: '10px',
          width: element.width,
          textAlign: 'center',
          lineHeight: 1.1
        }}
        className={`transition-all duration-150 ${isSelected ? 'border-2 border-dashed border-decho-blue rounded-lg' : 'border-2 border-dashed border-transparent'}`}
      >
        {element.text || "..."}
      </div>
    </Draggable>
  );
};

const CardPreview = ({ cardData, frontCardRef, backCardRef, setCardData, selectedElement, setSelectedElement }) => {
  const commonWrapperStyle = {
    width: `${CARD_WIDTH_PX * DISPLAY_SCALE}px`,
    height: `${CARD_HEIGHT_PX * DISPLAY_SCALE}px`,
  };
  const commonCardStyle = {
    width: `${CARD_WIDTH_PX}px`,
    height: `${CARD_HEIGHT_PX}px`,
    transform: `scale(${DISPLAY_SCALE})`,
    transformOrigin: 'top left',
    position: 'relative',
    overflow: 'hidden',
  };

  const handleTextDragStop = (id, position) => {
    setCardData(prev => ({
      ...prev,
      textElements: prev.textElements.map(el =>
        el.id === id ? { ...el, position } : el
      )
    }));
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="space-y-6">
        <div className="mx-auto rounded-lg overflow-hidden card-shadow" style={commonWrapperStyle} onClick={() => setSelectedElement(null)}>
          <div ref={frontCardRef} style={{ ...commonCardStyle, background: '#e5ded5' }}>
            {cardData.image && (
              <img src={cardData.image} alt="User upload" style={{ position: 'absolute', top: '145px', left: '75px', width: '600px', height: '400px', objectFit: 'cover', transform: `scale(${cardData.imageScale})` }} />
            )}
            <img src={CARD_FRONT_URL} alt="Card Front Template" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
            {cardData.textElements.map(el => (
              <DraggableText key={el.id} element={el} onStop={handleTextDragStop} onSelect={setSelectedElement} isSelected={selectedElement?.id === el.id} scale={DISPLAY_SCALE} />
            ))}
          </div>
        </div>
        <div className="mx-auto rounded-lg overflow-hidden card-shadow" style={commonWrapperStyle}>
          <div ref={backCardRef} style={{ ...commonCardStyle, background: 'white' }}>
            <img src={CARD_BACK_URL} alt="Card Back Template" style={{ width: '100%', height: '100%' }} />
            {cardData.qrCode && (
              <img src={cardData.qrCode} alt="QR Code" style={{ position: 'absolute', left: '90px', top: '750px', width: '220px', height: '220px' }} />
            )}
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 mt-4">Card Size: 2.5" × 3.5" (Print Quality)</p>
    </motion.div>
  );
};

export default CardPreview;

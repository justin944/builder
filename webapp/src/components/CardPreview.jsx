
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const CardPreview = ({ template, cardData }) => {
  const frontCardRef = useRef(null);
  const backCardRef = useRef(null);

  const CARD_WIDTH_INCHES = 2.5;
  const CARD_HEIGHT_INCHES = 3.5;
  const DPI = 300;
  const CARD_WIDTH_PX = CARD_WIDTH_INCHES * DPI;
  const CARD_HEIGHT_PX = CARD_HEIGHT_INCHES * DPI;

  const DISPLAY_SCALE = 0.4;

  const handleDownload = () => {
    toast({
      title: "Download feature",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const getTemplateColors = () => {
    switch (template.id) {
      case 'kids':
        return {
          primary: '#FF6B9D',
          secondary: '#C084FC',
          accent: '#FDE68A'
        };
      case 'musicians':
        return {
          primary: '#3B82F6',
          secondary: '#06B6D4',
          accent: '#A78BFA'
        };
      case 'athletes':
        return {
          primary: '#F97316',
          secondary: '#EF4444',
          accent: '#FCD34D'
        };
      case 'vendors':
        return {
          primary: '#10B981',
          secondary: '#059669',
          accent: '#34D399'
        };
      case 'businesses':
        return {
          primary: '#6366F1',
          secondary: '#8B5CF6',
          accent: '#A78BFA'
        };
      default:
        return {
          primary: '#8B5CF6',
          secondary: '#EC4899',
          accent: '#F59E0B'
        };
    }
  };

  const colors = getTemplateColors();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-effect rounded-2xl p-6 card-shadow sticky top-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Card Preview
        </h2>
        <Button
          onClick={handleDownload}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-3">Front Side</p>
          <div 
            className="mx-auto rounded-lg overflow-hidden card-shadow"
            style={{
              width: `${CARD_WIDTH_PX * DISPLAY_SCALE}px`,
              height: `${CARD_HEIGHT_PX * DISPLAY_SCALE}px`
            }}
          >
            <div
              ref={frontCardRef}
              style={{
                width: `${CARD_WIDTH_PX}px`,
                height: `${CARD_HEIGHT_PX}px`,
                transform: `scale(${DISPLAY_SCALE})`,
                transformOrigin: 'top left',
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '60px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '600px',
                  height: '600px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '15px solid white',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}
              >
                {cardData.image ? (
                  <img
                    src={cardData.image}
                    alt="Profile"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: `scale(${cardData.imageScale}) translate(${cardData.imagePosition.x}px, ${cardData.imagePosition.y}px)`
                    }}
                  />
                ) : (
                  <div 
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'rgba(255,255,255,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px',
                      color: 'white'
                    }}
                  >
                    Photo
                  </div>
                )}
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: '40px',
                  left: '0',
                  right: '0',
                  textAlign: 'center',
                  color: 'white',
                  padding: '0 40px'
                }}
              >
                <div
                  style={{
                    fontSize: '72px',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    letterSpacing: '2px'
                  }}
                >
                  {cardData.name || 'Your Name'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-600 mb-3">Back Side</p>
          <div 
            className="mx-auto rounded-lg overflow-hidden card-shadow"
            style={{
              width: `${CARD_WIDTH_PX * DISPLAY_SCALE}px`,
              height: `${CARD_HEIGHT_PX * DISPLAY_SCALE}px`
            }}
          >
            <div
              ref={backCardRef}
              style={{
                width: `${CARD_WIDTH_PX}px`,
                height: `${CARD_HEIGHT_PX}px`,
                transform: `scale(${DISPLAY_SCALE})`,
                transformOrigin: 'top left',
                background: 'white',
                position: 'relative',
                padding: '60px 50px'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '30px',
                  background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
                }}
              />

              <div style={{ marginBottom: '40px' }}>
                <div
                  style={{
                    fontSize: '56px',
                    fontWeight: 'bold',
                    color: colors.primary,
                    marginBottom: '30px',
                    lineHeight: '1.2'
                  }}
                >
                  {cardData.name || 'Your Name'}
                </div>
                
                <div style={{ fontSize: '36px', color: '#374151', lineHeight: '1.6' }}>
                  {cardData.line1 && <div style={{ marginBottom: '15px' }}>{cardData.line1}</div>}
                  {cardData.line2 && <div style={{ marginBottom: '15px' }}>{cardData.line2}</div>}
                  {cardData.line3 && <div style={{ marginBottom: '15px' }}>{cardData.line3}</div>}
                  {cardData.line4 && <div style={{ marginBottom: '15px' }}>{cardData.line4}</div>}
                </div>
              </div>

              {cardData.qrCode && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '60px',
                    right: '50px',
                    width: '200px',
                    height: '200px',
                    padding: '10px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <img
                    src={cardData.qrCode}
                    alt="QR Code"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  height: '30px',
                  background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
                }}
              />
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 pt-4 border-t-2 border-gray-200">
          <p>Card Size: 2.5" × 3.5" (300 DPI)</p>
          <p className="mt-1">Print-ready quality preview</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CardPreview;
  
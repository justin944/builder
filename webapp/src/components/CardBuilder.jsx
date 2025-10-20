
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TemplateSelector from '@/components/TemplateSelector';
import CardEditor from '@/components/CardEditor';
import CardPreview from '@/components/CardPreview';
import { Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import * as htmlToImage from 'html-to-image';
import QRCode from 'qrcode';

const CardBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [savedCardId, setSavedCardId] = useState(null);

  const [cardData, setCardData] = useState({
    image: null,
    imageScale: 1,
    imagePosition: { x: 0, y: 0 },
    name: '',
    line1: '',
    line2: '',
    line3: '',
    line4: '',
    qrCode: null,
  });

  const frontCardRef = useRef(null);
  const backCardRef = useRef(null);

  useEffect(() => {
    const savedData = localStorage.getItem('cardBuilderData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setCardData(parsed);
        if (parsed.templateId) {
          const templates = [
            { id: 'kids', name: 'Kids' },
            { id: 'musicians', name: 'Musicians' },
            { id: 'athletes', name: 'Athletes' },
            { id: 'vendors', name: 'Vendors' },
            { id: 'businesses', name: 'Businesses' },
          ];
          const foundTemplate = templates.find(t => t.id === parsed.templateId);
          if (foundTemplate) {
            setSelectedTemplate(foundTemplate);
          }
        }
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cardBuilderData', JSON.stringify({ ...cardData, templateId: selectedTemplate?.id }));
  }, [cardData, selectedTemplate]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setSaveStatus(null);
    setSavedCardId(null);
  };

  const handleBack = () => {
    setSelectedTemplate(null);
  };

  const handleSaveAndContinue = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    setSavedCardId(null);

    try {
      if (!frontCardRef.current || !backCardRef.current) {
        throw new Error("Card preview elements not found.");
      }
      
      const cardId = crypto.randomUUID();
      const profileUrl = `https://dechocards.com/card/${cardId}`;
      
      const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
        width: 200, margin: 1, color: { dark: '#000000', light: '#FFFFFF' }
      });
      
      const updatedCardData = { ...cardData, qrCode: qrCodeDataUrl };
      setCardData(updatedCardData);
      
      await new Promise(resolve => setTimeout(resolve, 100));

      const imageFront = await htmlToImage.toPng(frontCardRef.current);
      const imageBack = await htmlToImage.toPng(backCardRef.current);

      const payload = {
        card_id: cardId,
        template: selectedTemplate.id,
        user_id: 0,
        text_fields: {
          name: cardData.name,
          line1: cardData.line1,
          line2: cardData.line2,
          line3: cardData.line3,
          line4: cardData.line4,
        },
        image_front: imageFront.split(',')[1],
        image_back: imageBack.split(',')[1]
      };
      
      const response = await fetch('https://dechocards.com/wp-json/decho/v1/save-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Decho-Key': 'xY82D1m9@Decho!20251015'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save card.');
      }
      
      const result = await response.json();
      setSaveStatus('success');
      setSavedCardId(result.card_id);
      toast({
        title: "Card Saved Successfully! 🎉",
        description: `Your card ID is: ${result.card_id}`,
      });
      
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
      toast({
        title: "Save Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <AnimatePresence mode="wait">
          {!selectedTemplate ? (
            <motion.div key="selector" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                  DechoCards Builder
                </h1>
                <p className="text-gray-600 text-lg mt-2">Choose a template to get started</p>
              </div>
              <TemplateSelector onSelect={handleTemplateSelect} />
            </motion.div>
          ) : (
            <motion.div key="builder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid lg:grid-cols-2 gap-8">
                <CardEditor
                  template={selectedTemplate}
                  cardData={cardData}
                  setCardData={setCardData}
                  onBack={handleBack}
                />
                <div className="sticky top-8">
                  <CardPreview
                    template={selectedTemplate}
                    cardData={cardData}
                    frontCardRef={frontCardRef}
                    backCardRef={backCardRef}
                  />
                  <div className="mt-6">
                    <Button
                      onClick={handleSaveAndContinue}
                      disabled={isSaving}
                      className="w-full text-lg py-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold"
                    >
                      {isSaving ? (
                        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-6 h-6 mr-2" />
                      )}
                      {isSaving ? 'Saving Your Masterpiece...' : 'Save & Continue'}
                    </Button>
                    {saveStatus === 'success' && savedCardId && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg flex items-center gap-3">
                        <CheckCircle className="w-5 h-5" />
                        <div>
                          <p className="font-semibold">Success! Card saved.</p>
                          <p className="text-sm">Card ID: {savedCardId}</p>
                        </div>
                      </motion.div>
                    )}
                    {saveStatus === 'error' && (
                       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        <p className="font-semibold">Oops! Something went wrong. Please try again.</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CardBuilder;

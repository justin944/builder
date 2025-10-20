
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TemplateSelector from '@/components/TemplateSelector';
import CardEditor from '@/components/CardEditor';
import CardPreview from '@/components/CardPreview';
import { Sparkles } from 'lucide-react';

const CardBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
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
    profileUrl: ''
  });

  useEffect(() => {
    const savedData = localStorage.getItem('cardBuilderData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setCardData(parsed);
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cardBuilderData', JSON.stringify(cardData));
  }, [cardData]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleBack = () => {
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
              DechoCards Builder
            </h1>
            <Sparkles className="w-8 h-8 text-pink-600" />
          </motion.div>
          <p className="text-gray-600 text-lg">Create your perfect professional card in minutes</p>
        </div>

        <AnimatePresence mode="wait">
          {!selectedTemplate ? (
            <TemplateSelector onSelect={handleTemplateSelect} />
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              <CardEditor
                template={selectedTemplate}
                cardData={cardData}
                setCardData={setCardData}
                onBack={handleBack}
              />
              <CardPreview
                template={selectedTemplate}
                cardData={cardData}
              />
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CardBuilder;
  
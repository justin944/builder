
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import CardEditor from '@/components/CardEditor';
import CardPreview from '@/components/CardPreview';
import { Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import * as htmlToImage from 'html-to-image';
import QRCode from 'qrcode';

const DECHO_CARD_TEMPLATE = {
  id: 'decho-card',
  name: 'Decho Card'
};

const initialTextElement = (text, y, fontSize, fontFamily, color) => ({
  id: crypto.randomUUID(),
  text,
  position: { x: 0, y },
  fontSize,
  fontFamily,
  color,
  width: 750,
});

const CardBuilder = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  const [cardData, setCardData] = useState({
    image: null,
    imageScale: 1,
    imagePosition: { x: 0, y: 0 },
    qrCode: null,
    textElements: [
      initialTextElement('Your Name', 600, 100, 'Bangers', '#00AEEF'),
      initialTextElement('Line 1 Text', 710, 50, 'Luckiest Guy', '#F37021'),
      initialTextElement('Line 2 Text', 770, 50, 'Kalam', '#000000'),
      initialTextElement('Line 3 Text', 830, 50, 'Roboto', '#000000'),
    ],
  });

  const frontCardRef = useRef(null);
  const backCardRef = useRef(null);

  useEffect(() => {
    const savedData = localStorage.getItem('cardBuilderData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.image || parsed.textElements.some(t => t.text)) {
           setCardData(parsed);
        }
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cardBuilderData', JSON.stringify(cardData));
  }, [cardData]);
  
  const sendEmailWithAttachment = async (userEmail, cardName, frontImageBase64, backImageBase64) => {
    const brevoApiKey = import.meta.env.VITE_BREVO_API_KEY;

    if (!brevoApiKey || brevoApiKey === "YOUR_BREVO_API_KEY_HERE") {
        console.warn("Brevo API key not configured. Skipping email.");
        toast({ title: "Email not sent", description: "Brevo API key is not configured.", variant: "destructive" });
        return;
    }

    const payload = {
      sender: { name: "DechoCards Builder", email: "builder@dechocards.com" },
      to: [{ email: "info@dechocards.com", name: "DechoCards Admin" }],
      subject: "New Decho Card Created",
      htmlContent: `<html><body><h1>New Decho Card Ready for Print!</h1><p><strong>Card Name:</strong> ${cardName || 'N/A'}</p><p><strong>User Email:</strong> ${userEmail || 'N/A'}</p><p>The print-ready PNG files are attached.</p></body></html>`,
      attachment: [
        { content: frontImageBase64, name: "decho-card-front.png" },
        { content: backImageBase64, name: "decho-card-back.png" },
      ],
    };

    try {
      const response = await fetch('/brevo-api/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': brevoApiKey },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error((await response.json()).message || 'Failed to send email');
      toast({ title: "Email Sent! 📬", description: "Print files sent to info@dechocards.com." });
    } catch (error) {
      console.error("Email sending failed:", error);
      toast({ title: "Email Sending Failed", description: error.message, variant: "destructive" });
    }
  };


  const handleSaveAndContinue = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    setSelectedElement(null); // Deselect any element
    
    await new Promise(resolve => setTimeout(resolve, 100)); // allow deselect to render

    try {
      if (!frontCardRef.current || !backCardRef.current) throw new Error("Card preview elements not found.");

      const headers = { 'Content-Type': 'application/json', 'X-Decho-Key': 'xY82D1m9@Decho!20251015' };
      let userEmail = null;
      try {
        const userResponse = await fetch('/wp-json/wp/v2/users/me', { headers, signal: AbortSignal.timeout(5000) });
        if (userResponse.ok) userEmail = (await userResponse.json()).email;
        else console.warn("Could not fetch logged-in user. Proceeding as guest.");
      } catch(e) { console.warn("User fetch failed. Proceeding as guest.")}
      
      const cardId = crypto.randomUUID();
      const qrCodeDataUrl = await QRCode.toDataURL(`https://dechocards.com/card/${cardId}`, { width: 200, margin: 1, color: { dark: '#F37021', light: '#00000000' } });
      
      setCardData(prev => ({...prev, qrCode: qrCodeDataUrl}));
      await new Promise(resolve => setTimeout(resolve, 200)); // allow QR to render

      const imageFront = await htmlToImage.toPng(frontCardRef.current);
      const imageBack = await htmlToImage.toPng(backCardRef.current);

      const payload = {
        card_id: cardId,
        template: DECHO_CARD_TEMPLATE.id,
        user_id: 0, 
        text_fields: cardData.textElements.reduce((acc, el, i) => {
          const key = i === 0 ? 'name' : `line${i}`;
          acc[key] = el.text;
          return acc;
        }, {}),
        image_front: imageFront.split(',')[1],
      };
      
      const response = await fetch('/wp-json/decho/v1/save-card', { method: 'POST', headers, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error((await response.json()).message || 'Failed to save card.');
      
      const result = await response.json();
      setSaveStatus('success');
      toast({ title: "Card Saved! Redirecting...", description: `Card ID: ${result.card_id}` });

      await sendEmailWithAttachment(userEmail, cardData.textElements[0]?.text, imageFront.split(',')[1], imageBack.split(',')[1]);

      setTimeout(() => {
        window.top.location.href = `https://dechocards.com/product/decho-cards/?decho_card_id=${result.card_id}`;
      }, 2000);
      
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
      toast({ title: "Save Failed", description: error.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="grid lg:grid-cols-[1fr,450px] gap-8">
          <CardEditor
            cardData={cardData}
            setCardData={setCardData}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
          />
          <div className="sticky top-8 self-start">
            <CardPreview
              cardData={cardData}
              frontCardRef={frontCardRef}
              backCardRef={backCardRef}
              setCardData={setCardData}
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
            />
            <div className="mt-6">
              <Button
                onClick={handleSaveAndContinue}
                disabled={isSaving}
                className="w-full text-lg py-6 bg-decho-orange hover:bg-decho-orange/90 text-white font-bold"
              >
                {isSaving ? <Loader2 className="w-6 h-6 mr-2 animate-spin" /> : <Sparkles className="w-6 h-6 mr-2" />}
                {isSaving ? 'Saving Your Masterpiece...' : 'Save & Continue'}
              </Button>
              {saveStatus && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                  className={`mt-4 p-4 border rounded-lg flex items-center gap-3 ${saveStatus === 'success' ? 'bg-green-100 border-green-400 text-green-800' : 'bg-red-100 border-red-400 text-red-800'}`}
                >
                  {saveStatus === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <p className="font-semibold">{saveStatus === 'success' ? 'Success! Redirecting you now...' : 'Oops! Something went wrong.'}</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CardBuilder;

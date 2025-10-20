
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Upload, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import QRCode from 'qrcode';

const CardEditor = ({ template, cardData, setCardData, onBack }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setCardData(prev => ({
          ...prev,
          image: event.target.result,
          imageScale: 1,
          imagePosition: { x: 0, y: 0 }
        }));
        toast({
          title: "Image uploaded! 🎉",
          description: "Use the slider to resize your image"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const fakeEvent = { target: { files: [file] } };
      handleImageUpload(fakeEvent);
    }
  };

  const generateQRCode = async () => {
    if (!cardData.profileUrl) {
      toast({
        title: "Profile URL required",
        description: "Please enter a profile URL first",
        variant: "destructive"
      });
      return;
    }

    try {
      const qrCodeDataUrl = await QRCode.toDataURL(cardData.profileUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setCardData(prev => ({ ...prev, qrCode: qrCodeDataUrl }));
      toast({
        title: "QR Code generated! ✨",
        description: "Your unique QR code is ready"
      });
    } catch (error) {
      toast({
        title: "Error generating QR code",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass-effect rounded-2xl p-6 card-shadow"
    >
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 hover:bg-purple-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Templates
      </Button>

      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Customize Your {template.name} Card
      </h2>

      <div className="space-y-6">
        <div>
          <Label className="text-lg font-semibold mb-3 block">Upload Photo</Label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              isDragging 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {cardData.image ? (
              <div className="space-y-3">
                <ImageIcon className="w-12 h-12 mx-auto text-green-500" />
                <p className="text-sm text-gray-600">Image uploaded successfully!</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="mt-2"
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Choose Image
                </Button>
              </div>
            )}
          </div>

          {cardData.image && (
            <div className="mt-4 space-y-3">
              <Label className="text-sm font-medium">Image Size</Label>
              <Slider
                value={[cardData.imageScale]}
                onValueChange={(value) => setCardData(prev => ({ ...prev, imageScale: value[0] }))}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Scale: {cardData.imageScale.toFixed(1)}x</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-semibold">Name</Label>
            <Input
              id="name"
              value={cardData.name}
              onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your name"
              className="mt-2 border-2 focus:border-purple-400"
            />
          </div>

          <div>
            <Label htmlFor="line1" className="text-sm font-semibold">Line 1</Label>
            <Input
              id="line1"
              value={cardData.line1}
              onChange={(e) => setCardData(prev => ({ ...prev, line1: e.target.value }))}
              placeholder="Title or position"
              className="mt-2 border-2 focus:border-purple-400"
            />
          </div>

          <div>
            <Label htmlFor="line2" className="text-sm font-semibold">Line 2</Label>
            <Input
              id="line2"
              value={cardData.line2}
              onChange={(e) => setCardData(prev => ({ ...prev, line2: e.target.value }))}
              placeholder="Additional info"
              className="mt-2 border-2 focus:border-purple-400"
            />
          </div>

          <div>
            <Label htmlFor="line3" className="text-sm font-semibold">Line 3</Label>
            <Input
              id="line3"
              value={cardData.line3}
              onChange={(e) => setCardData(prev => ({ ...prev, line3: e.target.value }))}
              placeholder="Contact or details"
              className="mt-2 border-2 focus:border-purple-400"
            />
          </div>

          <div>
            <Label htmlFor="line4" className="text-sm font-semibold">Line 4</Label>
            <Input
              id="line4"
              value={cardData.line4}
              onChange={(e) => setCardData(prev => ({ ...prev, line4: e.target.value }))}
              placeholder="Additional details"
              className="mt-2 border-2 focus:border-purple-400"
            />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t-2 border-gray-200">
          <Label htmlFor="profileUrl" className="text-sm font-semibold flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Profile URL
          </Label>
          <Input
            id="profileUrl"
            value={cardData.profileUrl}
            onChange={(e) => setCardData(prev => ({ ...prev, profileUrl: e.target.value }))}
            placeholder="https://dechocards.com/your-profile"
            className="border-2 focus:border-purple-400"
          />
          <Button
            onClick={generateQRCode}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            Generate QR Code
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CardEditor;
  
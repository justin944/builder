
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Upload, Image as ImageIcon, Type, Palette, ArrowDownUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HexColorPicker } from "react-colorful";

const FONTS = [
  { name: 'Bangers', family: 'Bangers, cursive' },
  { name: 'Luckiest Guy', family: '"Luckiest Guy", cursive' },
  { name: 'Kalam', family: 'Kalam, cursive' },
  { name: 'Roboto', family: 'Roboto, sans-serif' },
  { name: 'Inter', family: 'Inter, sans-serif' },
];

const CardEditor = ({ cardData, setCardData, selectedElement, setSelectedElement }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please upload an image smaller than 5MB", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setCardData(prev => ({ ...prev, image: event.target.result, imageScale: 1, imagePosition: { x: 0, y: 0 } }));
        toast({ title: "Image uploaded! 🎉", description: "Use the slider to resize your image" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (id, newText) => {
    setCardData(prev => ({
      ...prev,
      textElements: prev.textElements.map(el => el.id === id ? { ...el, text: newText } : el)
    }));
  };
  
  const updateSelectedElement = (property, value) => {
    if (!selectedElement) return;
    setCardData(prev => ({
      ...prev,
      textElements: prev.textElements.map(el => el.id === selectedElement.id ? { ...el, [property]: value } : el)
    }));
    setSelectedElement(prev => ({...prev, [property]: value}));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-50/50 rounded-2xl p-6 border"
    >
      <h1 className="text-3xl font-black bg-gradient-to-r from-decho-blue to-decho-orange bg-clip-text text-transparent mb-1">
        Decho Card Builder
      </h1>
      <p className="text-gray-500 mb-6">Customize your card. Click text on the preview to edit.</p>

      <div className="space-y-6">
        <div>
          <Label className="text-lg font-bold text-gray-700 mb-3 block">1. Upload Photo</Label>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleImageUpload({ target: { files: e.dataTransfer.files } }); }}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${isDragging ? 'border-decho-blue bg-blue-50' : 'border-gray-300 hover:border-decho-blue'}`}
          >
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            {cardData.image ? (
              <div className="space-y-2">
                <ImageIcon className="w-10 h-10 mx-auto text-green-500" />
                <p className="text-sm font-semibold text-gray-700">Image ready!</p>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">Change</Button>
              </div>
            ) : (
              <div className="space-y-2 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-10 h-10 mx-auto text-gray-400" />
                <p className="text-sm text-gray-500">Drag & drop or <span className="text-decho-blue font-semibold">click to upload</span></p>
              </div>
            )}
          </div>
          {cardData.image && (
            <div className="mt-4 space-y-2">
              <Label className="text-sm font-medium">Image Size</Label>
              <Slider value={[cardData.imageScale]} onValueChange={(v) => setCardData(p => ({ ...p, imageScale: v[0] }))} min={0.5} max={3} step={0.01} />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-bold text-gray-700 mb-1 block">2. Edit Details</Label>
          {cardData.textElements && cardData.textElements.map((el, i) => (
            <div key={el.id}>
              <Label htmlFor={el.id} className="text-sm font-semibold">{i === 0 ? 'Name' : `Line ${i + 1}`}</Label>
              <Input id={el.id} value={el.text} onChange={(e) => handleTextChange(el.id, e.target.value)} placeholder={`Enter ${i === 0 ? 'Name' : `Line ${i + 1}`}`} className="mt-1" onFocus={() => setSelectedElement(el)} />
            </div>
          ))}
        </div>
        
        {selectedElement && (
           <motion.div initial={{opacity:0, height: 0}} animate={{opacity:1, height: 'auto'}} className="space-y-4 p-4 bg-blue-50 rounded-lg border border-decho-blue">
            <h3 className="text-lg font-bold text-gray-700">Styling Tools</h3>
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <Label className="text-sm font-semibold flex items-center gap-2"><Type size={14} /> Font</Label>
                <Select value={selectedElement.fontFamily} onValueChange={(v) => updateSelectedElement('fontFamily', v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select font" /></SelectTrigger>
                  <SelectContent>{FONTS.map(f => <SelectItem key={f.name} value={f.family} style={{fontFamily: f.family}}>{f.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-semibold flex items-center gap-2"><Palette size={14}/> Color</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full mt-1 justify-start">
                      <div className="w-4 h-4 rounded-full mr-2 border" style={{backgroundColor: selectedElement.color}}></div>
                      {selectedElement.color}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-0"><HexColorPicker color={selectedElement.color} onChange={(v) => updateSelectedElement('color', v)} /></PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold flex items-center gap-2"><ArrowDownUp size={14} /> Font Size</Label>
              <Slider className="mt-2" value={[selectedElement.fontSize]} onValueChange={(v) => updateSelectedElement('fontSize', v[0])} min={20} max={150} step={1} />
              <p className="text-xs text-right text-gray-500">{selectedElement.fontSize}px</p>
            </div>
           </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CardEditor;
  
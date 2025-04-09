
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PresaleDisabledPopupProps {
  onClose: () => void;
}

const PresaleDisabledPopup = ({ onClose }: PresaleDisabledPopupProps) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Close Button in top right */}
      <div className="absolute top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onClose} 
          className="bg-white/90 hover:bg-white"
        >
          <X size={18} />
        </Button>
      </div>
      
      {/* Full-screen image */}
      <div className="flex-1 relative overflow-hidden">
        <img 
          src="/lovable-uploads/6e7c8d90-17c8-4344-a021-c36959c813e7.png" 
          alt="Too Early Dawg" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default PresaleDisabledPopup;

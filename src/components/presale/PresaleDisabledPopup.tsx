
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PresaleDisabledPopupProps {
  onClose: () => void;
}

const PresaleDisabledPopup = ({ onClose }: PresaleDisabledPopupProps) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Close Button in top right */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onClose} 
          className="bg-white/90 hover:bg-white"
        >
          <X size={18} />
        </Button>
        
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2 bg-white/90 hover:bg-white">
            <Home size={18} />
            <span>Home</span>
          </Button>
        </Link>
      </div>
      
      {/* Full-screen image */}
      <div className="flex-1 relative overflow-hidden">
        <img 
          src="/lovable-uploads/f513bf26-0a49-463f-a56c-5718cb26686d.png" 
          alt="Too Early Dawg" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default PresaleDisabledPopup;

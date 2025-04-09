
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PresaleDisabledPopup = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Home Button in top right */}
      <div className="absolute top-4 right-4 z-50">
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


import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface PresaleDisabledPopupProps {
  onClose: () => void;
}

const PresaleDisabledPopup = ({ onClose }: PresaleDisabledPopupProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Close Button - larger target area on mobile */}
      <div className="absolute top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size={isMobile ? "lg" : "icon"}
          onClick={onClose} 
          className={`bg-white/90 hover:bg-white ${isMobile ? 'p-2' : ''}`}
        >
          <X size={isMobile ? 24 : 18} />
          {isMobile && <span className="sr-only">Close</span>}
        </Button>
      </div>
      
      {/* Full-screen image with mobile optimizations */}
      <div className="flex-1 relative overflow-hidden">
        <img 
          src="/lovable-uploads/3f337a2b-01a9-49bc-877b-b2809e980e83.png" 
          alt="Too Early Dawg" 
          className="w-full h-full object-contain md:object-cover"
          loading="eager" 
          width={isMobile ? 390 : 1280}
          height={isMobile ? 844 : 720}
        />
      </div>
    </div>
  );
};

export default PresaleDisabledPopup;

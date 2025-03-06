
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const IntroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-lg mb-8 h-[300px]">
      {/* Background image - use cover positioning to fill entire space */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: "url('https://i.imghippo.com/files/vWPh5294lmg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
      
      {/* Content overlay with improved contrast for better text readability */}
      <div className="relative z-10 p-6 bg-dawg-dark/50 h-full flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-6 w-6 text-dawg" />
          <h1 className="text-3xl md:text-4xl font-black text-dawg">Dawg Shameboard</h1>
        </div>
        <p className="text-white max-w-3xl text-lg">
          Use this board to monitor the people who were approved in the DAWG application process. 
          In an effort to maintain transparency in the process, we are revealing those who sold 
          over 50% of their allocation, and are tracking attempts to obscure trading patterns.
        </p>
      </div>
    </div>
  );
};

export default IntroSection;


import React from 'react';
import { AlertTriangle } from 'lucide-react';

const IntroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-lg mb-8 h-[300px]">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: "url('https://i.imghippo.com/files/vWPh5294lmg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }} 
      />
      
      {/* Gradient overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-5"></div>
      
      {/* Content */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="text-dawg h-6 w-6" />
          <h1 className="text-3xl md:text-4xl font-black text-dawg">Dawg Shameboard</h1>
        </div>
        <p className="text-white max-w-3xl text-shadow">
          Use this board to monitor the people who were approved in the DAWG application process. 
          In an effort to maintain transparency in the process, we are revealing those who sold 
          over 50% of their allocation, and are tracking attempts to obscure trading patterns.
        </p>
      </div>
    </div>
  );
};

export default IntroSection;

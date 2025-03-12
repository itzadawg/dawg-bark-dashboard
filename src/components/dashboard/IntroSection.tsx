
import React from 'react';

const IntroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-lg mb-8 min-h-[200px] md:h-[300px]">
      {/* Background image with mobile-friendly sizing */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: "url('https://i.imghippo.com/files/vWPh5294lmg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }} 
      />
      
      {/* Content overlay with improved mobile padding and text sizing */}
      <div className="relative z-10 p-4 md:p-6 bg-dawg-dark/50 h-full flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-2 md:mb-3">
          <h1 className="text-2xl md:text-4xl font-black text-dawg">Dawg Shameboard</h1>
        </div>
        <p className="text-white max-w-3xl text-base md:text-lg leading-relaxed">
          Use this board to monitor the people who were approved in the DAWG application process. 
          In an effort to maintain transparency in the process, we are revealing those who sold 
          over 50% of their allocation, and are tracking attempts to obscure trading patterns.
        </p>
      </div>
    </div>
  );
};

export default IntroSection;

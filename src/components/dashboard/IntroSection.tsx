
import React from 'react';

const IntroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-lg mb-8 h-[300px]">
      {/* Background image - now fully visible */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://i.imghippo.com/files/vWPh5294lmg.webp')",
          backgroundSize: "contain",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
          opacity: 1
          // Removed mask/gradient to make image fully visible
        }}
      />
      
      {/* Content with adjusted background for better text readability */}
      <div className="relative z-10 p-6 bg-dawg-light/70 neo-brutal-border h-full flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-black mb-2 text-dawg">Dawg Shameboard</h1>
        <p className="text-dawg-dark/80 max-w-3xl">
          Use this board to monitor the people who were approved in the DAWG application process. 
          In an effort to maintain transparency in the process, we are revealing those who sold 
          over 50% of their allocation, and are tracking attempts to obscure trading patterns.
        </p>
      </div>
    </div>
  );
};

export default IntroSection;

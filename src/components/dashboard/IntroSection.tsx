
import React from 'react';

const IntroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-lg mb-8 h-[300px]">
      {/* Background image - fully visible with no gaps */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://i.imghippo.com/files/vWPh5294lmg.webp')",
          backgroundSize: "cover", // Changed from "contain" to "cover" to fill entire space
          backgroundPosition: "center", // Center the image to avoid gaps
          backgroundRepeat: "no-repeat",
          opacity: 1
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

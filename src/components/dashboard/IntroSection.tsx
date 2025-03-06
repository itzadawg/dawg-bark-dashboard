
import React from 'react';

const IntroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-lg mb-8 h-[300px]">
      {/* Background image with gradient opacity */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://i.imghippo.com/files/vWPh5294lmg.webp')",
          backgroundSize: "contain",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
          opacity: 1,
          // Adjusted gradient to make right side more visible
          maskImage: "linear-gradient(to right, transparent, rgba(0,0,0,0.7) 20%, rgba(0,0,0,1))",
          WebkitMaskImage: "linear-gradient(to right, transparent, rgba(0,0,0,0.7) 20%, rgba(0,0,0,1))"
        }}
      />
      
      {/* Content with padding for better readability */}
      <div className="relative z-10 p-6 backdrop-blur-sm bg-dawg-light/40 neo-brutal-border h-full flex flex-col justify-center">
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

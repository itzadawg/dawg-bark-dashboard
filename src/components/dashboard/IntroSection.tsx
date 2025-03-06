
import React from 'react';

const IntroSection: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-black mb-2 text-dawg">Dawg Shameboard</h1>
      <p className="text-dawg-dark/80 max-w-3xl">
        Use this board to monitor the people who were approved in the DAWG application process. 
        In an effort to maintain transparency in the process, we are revealing those who sold 
        over 50% of their allocation, and are tracking attempts to obscure trading patterns.
      </p>
    </div>
  );
};

export default IntroSection;

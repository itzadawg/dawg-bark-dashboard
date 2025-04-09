import React from 'react';
import Header from '../components/dashboard/Header';

const Index = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://i.imghippo.com/files/HdYk9772Jys.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.9
        }}
      />
      
      {/* Dark overlay to improve text visibility */}
      <div className="absolute inset-0 z-0 bg-black bg-opacity-20"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <Header />
        <div className="container mx-auto px-4 py-8">
          {/* All content has been removed */}
        </div>
      </div>
    </div>
  );
};

export default Index;

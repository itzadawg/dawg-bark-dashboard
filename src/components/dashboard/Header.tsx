
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  // We're rendering this component conditionally based on the existence of useLocation
  // to ensure it works both inside and outside of Router contexts
  let currentPath = '/';
  
  try {
    // Only access router functionality if we're in a component tree with router context
    const { useLocation } = require('react-router-dom');
    const location = useLocation();
    currentPath = location.pathname;
  } catch (e) {
    console.log('Header rendered outside Router context');
  }
  
  return (
    <header className="w-full py-4 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <Link to="/" className="flex items-center mb-4 md:mb-0">
          <img 
            src="https://i.imghippo.com/files/sJBO3914Gdw.png" 
            alt="Dawg Logo" 
            className="h-16" 
          />
        </Link>
        
        <nav className="flex space-x-4">
          <Link 
            to="/presale" 
            className={`transform transition-transform duration-200 hover:scale-110 relative ${
              currentPath === '/presale' ? 'after:absolute after:inset-0 after:bg-dawg after:blur-md after:opacity-70 after:-z-10 after:rounded-full' : ''
            }`}
          >
            <img 
              src="/lovable-uploads/33de2017-f52b-4a6f-a520-55488dfaa03c.png"
              alt="Presale"
              className="h-12 relative z-10"
            />
          </Link>
          <Link 
            to="/gallery" 
            className={`transform transition-transform duration-200 hover:scale-110 relative ${
              currentPath === '/gallery' ? 'after:absolute after:inset-0 after:bg-dawg after:blur-md after:opacity-70 after:-z-10 after:rounded-full' : ''
            }`}
          >
            <img 
              src="/lovable-uploads/b7694506-fbc1-4e8a-96b5-618c34241608.png"
              alt="Gallery"
              className="h-12 relative z-10"
            />
          </Link>
          <a 
            href="https://x.com/itzadawg" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transform transition-transform duration-200 hover:scale-110 relative"
          >
            <img 
              src="/lovable-uploads/60a7bd3f-d42a-491d-b02e-4e83fa181f2b.png"
              alt="X (Twitter)"
              className="h-12 relative z-10"
            />
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;

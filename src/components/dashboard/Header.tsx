
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  
  return <header className="w-full py-4 bg-transparent">
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
              location.pathname === '/presale' ? 'after:absolute after:inset-0 after:bg-dawg after:blur-md after:opacity-70 after:-z-10 after:rounded-full' : ''
            }`}
          >
            <img 
              src="/lovable-uploads/33de2017-f52b-4a6f-a520-55488dfaa03c.png"
              alt="Presale"
              className="h-12 relative z-10"
            />
          </Link>
          <Link 
            to="/game" 
            className={`transform transition-transform duration-200 hover:scale-110 relative ${
              location.pathname === '/game' ? 'after:absolute after:inset-0 after:bg-dawg after:blur-md after:opacity-70 after:-z-10 after:rounded-full' : ''
            }`}
          >
            <img 
              src="/lovable-uploads/891c264a-33e2-4b9b-bb68-033e84559942.png"
              alt="Game"
              className="h-12 relative z-10"
            />
          </Link>
          <Link 
            to="/gallery" 
            className={`transform transition-transform duration-200 hover:scale-110 relative ${
              location.pathname === '/gallery' ? 'after:absolute after:inset-0 after:bg-dawg after:blur-md after:opacity-70 after:-z-10 after:rounded-full' : ''
            }`}
          >
            <img 
              src="/lovable-uploads/b7694506-fbc1-4e8a-96b5-618c34241608.png"
              alt="Gallery"
              className="h-12 relative z-10"
            />
          </Link>
        </nav>
      </div>
    </header>;
};

export default Header;

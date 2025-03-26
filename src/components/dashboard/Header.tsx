
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
              src="https://i.imghippo.com/files/mRu8010yo.png"
              alt="Presale"
              className="h-14 relative z-10"
            />
          </Link>
          <Link 
            to="/minigame" 
            className={`transform transition-transform duration-200 hover:scale-110 relative ${
              location.pathname === '/minigame' ? 'after:absolute after:inset-0 after:bg-dawg after:blur-md after:opacity-70 after:-z-10 after:rounded-full' : ''
            }`}
          >
            <img 
              src="https://i.imghippo.com/files/fkRM7011LiQ.png"
              alt="Minigame"
              className="h-14 relative z-10"
            />
          </Link>
          <Link 
            to="/shameboard" 
            className={`transform transition-transform duration-200 hover:scale-110 relative ${
              location.pathname === '/shameboard' ? 'after:absolute after:inset-0 after:bg-dawg after:blur-md after:opacity-70 after:-z-10 after:rounded-full' : ''
            }`}
          >
            <img 
              src="https://i.imghippo.com/files/M1109wC.png"
              alt="Shameboard"
              className="h-14 relative z-10"
            />
          </Link>
        </nav>
      </div>
    </header>;
};

export default Header;

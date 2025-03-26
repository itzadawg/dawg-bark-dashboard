
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Gamepad2, AlertTriangle } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  return <header className="w-full py-4 mb-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <Link to="/" className="flex items-center mb-4 md:mb-0">
          <img 
            src="https://i.imghippo.com/files/sJBO3914Gdw.png" 
            alt="Dawg Logo" 
            className="h-16" 
          />
        </Link>
        
        <nav className="flex space-x-2">
          <Link to="/presale" className={`neo-brutal-button flex items-center gap-2 ${location.pathname === '/presale' ? 'bg-dawg' : ''}`}>
            <span>Presale</span>
          </Link>
          <Link to="/minigame" className={`neo-brutal-button flex items-center gap-2 ${location.pathname === '/minigame' ? 'bg-dawg' : ''}`}>
            <span>Minigame</span>
          </Link>
          <Link to="/shameboard" className={`neo-brutal-button flex items-center gap-2 ${location.pathname === '/shameboard' ? 'bg-dawg' : ''}`}>
            <span>Shameboard</span>
          </Link>
        </nav>
      </div>
    </header>;
};

export default Header;

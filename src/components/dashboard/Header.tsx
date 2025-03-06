
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Gamepad2, AlertTriangle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 mb-8 bg-white neo-brutal-border">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <img 
            src="/lovable-uploads/d8974125-04c2-42e6-9cf1-402682800b74.png" 
            alt="Dawg Logo" 
            className="h-14 w-auto mr-4"
          />
          <h1 className="text-2xl font-black text-dawg-dark">Dawg</h1>
        </div>
        
        <nav className="flex space-x-2">
          <Link to="/presale" className="neo-brutal-button flex items-center gap-2">
            <ShoppingCart size={18} />
            <span>Presale</span>
          </Link>
          <Link to="/minigame" className="neo-brutal-button flex items-center gap-2">
            <Gamepad2 size={18} />
            <span>Minigame</span>
          </Link>
          <Link to="/" className="neo-brutal-button flex items-center gap-2 bg-dawg">
            <AlertTriangle size={18} />
            <span>Shameboard</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

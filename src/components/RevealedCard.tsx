
import React from 'react';
import { X } from 'lucide-react';

interface RevealedCardProps {
  name: string;
  balance: string;
  percent: string;
  time: string;
  avatar: string;
  emoji?: string;
}

const RevealedCard: React.FC<RevealedCardProps> = ({ 
  name, 
  balance, 
  percent, 
  time, 
  avatar,
  emoji 
}) => {
  const percentValue = parseFloat(percent);
  const isNegative = percentValue < 0;
  
  return (
    <div className="neo-brutal-box bg-dawg-light animate-fade-in hover:bg-dawg-secondary relative p-4">
      <div className="flex items-center gap-3">
        <img 
          src={avatar} 
          alt={name} 
          className="w-12 h-12 rounded-full neo-brutal-border object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <p className="font-bold">{name}</p>
            {emoji && <span>{emoji}</span>}
          </div>
          <div className="flex gap-6">
            <p className="text-sm">Balance: <span className="font-mono">{balance}</span></p>
            <p className={`text-sm ${isNegative ? 'percent-negative' : 'percent-positive'}`}>
              {percent}
            </p>
          </div>
        </div>
        <button className="absolute top-2 right-2 p-1 hover:bg-dawg-secondary transition-colors rounded-full">
          <X size={18} />
        </button>
      </div>
      <p className="text-xs mt-2 text-dawg-dark/70">Revealed: {time}</p>
    </div>
  );
};

export default RevealedCard;

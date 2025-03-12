
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
  const percentValue = parseFloat(percent || "0");
  const isNegative = percentValue < 0;
  
  return (
    <div className="neo-brutal-box bg-dawg-light animate-fade-in hover:bg-dawg-secondary relative p-3 sm:p-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div 
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full neo-brutal-border bg-transparent flex items-center justify-center"
        />
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <p className="font-bold text-sm sm:text-base">{name}</p>
            {emoji && <span className="text-sm sm:text-base">{emoji}</span>}
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-6">
            <p className="text-xs sm:text-sm">Balance: <span className="font-mono">{balance}</span></p>
            <p className={`text-xs sm:text-sm ${isNegative ? 'percent-negative' : 'percent-positive'}`}>
              {percent}
            </p>
          </div>
        </div>
        <button className="absolute top-2 right-2 p-1 hover:bg-dawg-secondary transition-colors rounded-full">
          <X size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>
      </div>
      <p className="text-[10px] sm:text-xs mt-2 text-dawg-dark/70">Revealed: {time}</p>
    </div>
  );
};

export default RevealedCard;

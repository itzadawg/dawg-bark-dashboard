
import React from 'react';
import { X } from 'lucide-react';

interface FumblerCardProps {
  name: string;
  amount: string;
  avatar: string;
}

const FumblerCard: React.FC<FumblerCardProps> = ({ name, amount, avatar }) => {
  return (
    <div className="neo-brutal-box bg-dawg-light animate-fade-in hover:bg-dawg-secondary relative p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
      <div 
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full neo-brutal-border bg-transparent flex items-center justify-center"
      />
      <div className="flex-1">
        <div className="flex flex-col">
          <p className="font-bold text-sm sm:text-base">{name}</p>
          <p className="text-xs sm:text-sm">Fumbled: <span className="font-bold">{amount}</span></p>
        </div>
      </div>
      <button className="absolute top-2 right-2 p-1 hover:bg-dawg-secondary transition-colors rounded-full">
        <X size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>
    </div>
  );
};

export default FumblerCard;

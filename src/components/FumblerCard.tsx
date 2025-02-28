
import React from 'react';
import { X } from 'lucide-react';

interface FumblerCardProps {
  name: string;
  amount: string;
  avatar: string;
}

const FumblerCard: React.FC<FumblerCardProps> = ({ name, amount, avatar }) => {
  return (
    <div className="neo-brutal-box bg-dawg-light animate-fade-in hover:bg-dawg-secondary relative p-4 flex items-center gap-3">
      <img 
        src={avatar} 
        alt={name} 
        className="w-12 h-12 rounded-full neo-brutal-border object-cover"
      />
      <div className="flex-1">
        <div className="flex flex-col">
          <p className="font-bold text-sm">{name}</p>
          <p className="text-sm">Fumbled: <span className="font-bold">{amount}</span></p>
        </div>
      </div>
      <button className="absolute top-2 right-2 p-1 hover:bg-dawg-secondary transition-colors rounded-full">
        <X size={18} />
      </button>
    </div>
  );
};

export default FumblerCard;

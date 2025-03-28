
import React from 'react';
import { Info } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogTrigger } from './ui/dialog';

interface TableRowProps {
  name: string;
  username: string;
  address: string;
  initial: string;
  current: string;
  balanceChange: string;
  activity: string;
  realizedPnL: string;
  avatar: string;
  emoji?: string;
  onViewDetails?: () => void;
}

const TableRow: React.FC<TableRowProps> = ({
  name,
  username,
  address,
  initial,
  current,
  balanceChange,
  activity,
  realizedPnL,
  avatar,
  emoji,
  onViewDetails
}) => {
  const percentValue = parseFloat(balanceChange?.replace('%', '') || "0");
  const isNegative = percentValue < 0;
  
  const getActivityBar = () => {
    const baseClasses = "w-16 sm:w-24 h-2 bg-dawg-dark";
    const barClasses = "h-full bg-dawg-accent";
    
    let widthClass = "w-0";
    if (activity === 'high') {
      widthClass = "w-full";
    } else if (activity === 'medium') {
      widthClass = "w-2/3";
    } else if (activity === 'low') {
      widthClass = "w-1/3";
    }
    
    return (
      <div className={baseClasses}>
        <div className={`${barClasses} ${widthClass}`}></div>
      </div>
    );
  };
  
  return (
    <tr className="border-b-2 border-black hover:bg-dawg-secondary transition-colors">
      <td className="py-2 sm:py-4 px-1 sm:px-2 w-[20%]">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full neo-brutal-border bg-transparent flex items-center justify-center overflow-hidden">
            {avatar && (
              <img src={avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="font-bold text-xs sm:text-base">{name}</p>
              {emoji && <span className="text-xs sm:text-base">{emoji}</span>}
            </div>
            <p className="text-[10px] sm:text-xs text-dawg-dark/70">{username}</p>
          </div>
        </div>
      </td>
      <td className="py-2 sm:py-4 px-1 sm:px-2 font-mono text-[10px] sm:text-xs hidden sm:table-cell w-[15%]">
        <div className="flex items-center">
          <span className="truncate">{address}</span>
        </div>
      </td>
      <td className="py-2 sm:py-4 px-1 sm:px-2 font-mono text-[10px] sm:text-xs w-[13%]">{initial}</td>
      <td className="py-2 sm:py-4 px-1 sm:px-2 font-mono text-[10px] sm:text-xs w-[13%]">{current}</td>
      <td className={`py-2 sm:py-4 px-1 sm:px-2 font-mono text-[10px] sm:text-xs w-[13%] ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
        {balanceChange}
      </td>
      <td className="py-2 sm:py-4 px-1 sm:px-2 w-[11%]">{getActivityBar()}</td>
      <td className="py-2 sm:py-4 px-1 sm:px-2 font-mono text-[10px] sm:text-xs w-[15%] flex items-center gap-1 sm:gap-2">
        <span>{realizedPnL}</span>
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="p-1 h-5 w-5 sm:h-6 sm:w-6" 
              onClick={(e) => {
                e.stopPropagation();
                if (onViewDetails) onViewDetails();
              }}
            >
              <Info size={12} className="sm:w-[14px] sm:h-[14px]" />
            </Button>
          </DialogTrigger>
        </Dialog>
      </td>
    </tr>
  );
};

export default TableRow;


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
  activity: 'low' | 'medium' | 'high' | 'none';
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
    switch (activity) {
      case 'high':
        return (
          <div className="w-24 h-2 bg-dawg-dark">
            <div className="h-full bg-dawg-accent w-full"></div>
          </div>
        );
      case 'medium':
        return (
          <div className="w-24 h-2 bg-dawg-dark">
            <div className="h-full bg-dawg-accent w-2/3"></div>
          </div>
        );
      case 'low':
        return (
          <div className="w-24 h-2 bg-dawg-dark">
            <div className="h-full bg-dawg-accent w-1/3"></div>
          </div>
        );
      default:
        return (
          <div className="w-24 h-2 bg-dawg-dark">
            <div className="h-full bg-dawg-dark/20 w-0"></div>
          </div>
        );
    }
  };
  
  return (
    <tr className="border-b-2 border-black hover:bg-dawg-secondary transition-colors">
      <td className="py-4 px-2 w-[20%]">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full neo-brutal-border bg-transparent flex items-center justify-center">
            {avatar && (
              <img src={avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="font-bold">{name}</p>
              {emoji && <span>{emoji}</span>}
            </div>
            <p className="text-xs text-dawg-dark/70">{username}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-2 font-mono text-xs w-[15%]">
        <div className="flex items-center">
          <span className="truncate">{address}</span>
        </div>
      </td>
      <td className="py-4 px-2 font-mono w-[13%]">{initial}</td>
      <td className="py-4 px-2 font-mono w-[13%]">{current}</td>
      <td className={`py-4 px-2 font-mono w-[13%] ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
        {balanceChange}
      </td>
      <td className="py-4 px-2 w-[11%]">{getActivityBar()}</td>
      <td className="py-4 px-2 font-mono w-[15%] flex items-center gap-2">
        <span>{realizedPnL}</span>
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="p-1 h-6 w-6" 
              onClick={(e) => {
                e.stopPropagation();
                if (onViewDetails) onViewDetails();
              }}
            >
              <Info size={14} />
            </Button>
          </DialogTrigger>
        </Dialog>
      </td>
    </tr>
  );
};

export default TableRow;

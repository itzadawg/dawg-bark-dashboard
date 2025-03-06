
import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import TableRow from '../TableRow';
import TableHeader from './TableHeader';
import { useDashboard, getDashboardData } from '../../contexts/DashboardContext';
import { Button } from '../ui/button';

const HoldersTable: React.FC = () => {
  const { showMasked, setShowMasked } = useDashboard();
  const { tableData } = getDashboardData();

  return (
    <div className="overflow-hidden neo-brutal-box p-0">
      <div className="flex justify-between items-center bg-dawg p-4 neo-brutal-border">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">DAWG Holders</h2>
          <div className="flex items-center text-xs bg-white text-dawg-dark px-2 py-1 rounded-full">
            <Info size={12} className="mr-1" />
            <span>{tableData.length} wallets</span>
          </div>
        </div>
        <Button 
          variant="outline"
          className="flex items-center gap-2 neo-brutal-button bg-white hover:bg-dawg-light" 
          onClick={() => setShowMasked(!showMasked)}
        >
          <AlertTriangle size={16} />
          <span>{showMasked ? "Hide masked entries" : "Show masked entries"}</span>
        </Button>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <TableHeader />
          </thead>
          <tbody>
            {tableData.map(row => (
              <TableRow 
                key={row.id}
                name={row.name} 
                username={row.username} 
                address={row.address} 
                initial={row.initial} 
                current={row.current} 
                balanceChange={row.balanceChange} 
                activity={row.activity} 
                realizedPnL={row.realizedPnL} 
                avatar={row.avatar} 
                emoji={row.emoji} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoldersTable;

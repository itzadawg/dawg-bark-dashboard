
import React from 'react';
import { AlertTriangle } from 'lucide-react';
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
        <h2 className="text-xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          DAWG Holders
        </h2>
        <Button 
          variant="outline"
          className="neo-brutal-button bg-white hover:bg-dawg-light text-dawg-dark font-medium text-sm"
          onClick={() => setShowMasked(!showMasked)}
        >
          {showMasked ? 'Hide' : 'Show'} masked entries
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

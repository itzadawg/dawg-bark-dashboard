
import React, { useState } from 'react';
import { AlertTriangle, Eye, EyeOff, Info } from 'lucide-react';
import TableRow from '../TableRow';
import TableHeader from './TableHeader';
import { useDashboard, getDashboardData } from '../../contexts/DashboardContext';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader as UITableHeader,
  TableRow as UITableRow,
} from '../ui/table';

// Define a type for activity values to avoid type errors
type ActivityLevel = 'high' | 'medium' | 'low' | 'none';

const HoldersTable: React.FC = () => {
  const { showMasked, setShowMasked } = useDashboard();
  const { tableData } = getDashboardData();
  const [selectedHolder, setSelectedHolder] = useState<typeof tableData[0] | null>(null);

  return (
    <div className="overflow-hidden neo-brutal-box p-0">
      <div className="flex justify-between items-center bg-dawg p-4 neo-brutal-border">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          DAWG Holders
        </h2>
        <Button 
          variant="outline"
          className="neo-brutal-button bg-white hover:bg-dawg-light text-dawg-dark font-medium text-sm flex gap-2 items-center"
          onClick={() => setShowMasked(!showMasked)}
        >
          {showMasked ? <EyeOff size={16} /> : <Eye size={16} />}
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
                onViewDetails={() => setSelectedHolder(row)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Holder Details Dialog */}
      <Dialog>
        <DialogContent className="max-w-3xl neo-brutal-box p-0 border-2 border-black">
          {selectedHolder && (
            <>
              <DialogHeader className="bg-dawg p-4 neo-brutal-border">
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Holder Details
                </DialogTitle>
                <DialogDescription className="text-dawg-dark">
                  Detailed information about this DAWG holder
                </DialogDescription>
              </DialogHeader>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full neo-brutal-border bg-transparent flex items-center justify-center">
                        {selectedHolder.avatar && (
                          <img src={selectedHolder.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold">{selectedHolder.name}</h3>
                          {selectedHolder.emoji && <span className="text-xl">{selectedHolder.emoji}</span>}
                        </div>
                        <p className="text-sm text-dawg-dark/70">{selectedHolder.username}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dawg-dark/70">Wallet Address</p>
                      <p className="font-mono text-sm break-all">{selectedHolder.address}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-dawg-dark/70">Initial Balance</p>
                        <p className="font-mono font-bold">{selectedHolder.initial}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-dawg-dark/70">Current Balance</p>
                        <p className="font-mono font-bold">{selectedHolder.current}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-dawg-dark/70">Balance Change</p>
                        <p className={`font-mono font-bold ${parseFloat(selectedHolder.balanceChange.replace('%', '')) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {selectedHolder.balanceChange}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-dawg-dark/70">Realized PnL</p>
                        <p className="font-mono font-bold">{selectedHolder.realizedPnL}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold text-dawg-dark/70">Activity Level</p>
                      <div className="flex items-center gap-2 mt-1">
                        {selectedHolder.activity === 'high' && <Badge className="bg-dawg-accent">High</Badge>}
                        {selectedHolder.activity === 'medium' && <Badge className="bg-dawg">Medium</Badge>}
                        {selectedHolder.activity === 'low' && <Badge className="bg-dawg-light">Low</Badge>}
                        {selectedHolder.activity === 'none' && <Badge className="bg-gray-300">None</Badge>}
                        <div className="w-24 h-2 bg-dawg-dark">
                          <div className={`h-full bg-dawg-accent ${
                            selectedHolder.activity as ActivityLevel === 'high' ? 'w-full' : 
                            selectedHolder.activity as ActivityLevel === 'medium' ? 'w-2/3' : 
                            selectedHolder.activity as ActivityLevel === 'low' ? 'w-1/3' : 'w-0'
                          }`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold mb-2">Recent Transactions</h4>
                  <div className="neo-brutal-box p-0 overflow-hidden">
                    <Table>
                      <UITableHeader>
                        <UITableRow className="bg-dawg-light">
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </UITableRow>
                      </UITableHeader>
                      <TableBody>
                        <UITableRow>
                          <TableCell className="font-mono">2025-03-09</TableCell>
                          <TableCell>Buy</TableCell>
                          <TableCell className="font-mono">+50.00 DAWG</TableCell>
                          <TableCell><Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge></TableCell>
                        </UITableRow>
                        <UITableRow>
                          <TableCell className="font-mono">2025-03-07</TableCell>
                          <TableCell>Sell</TableCell>
                          <TableCell className="font-mono">-10.00 DAWG</TableCell>
                          <TableCell><Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge></TableCell>
                        </UITableRow>
                        <UITableRow>
                          <TableCell className="font-mono">2025-03-05</TableCell>
                          <TableCell>Transfer</TableCell>
                          <TableCell className="font-mono">-5.00 DAWG</TableCell>
                          <TableCell><Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge></TableCell>
                        </UITableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HoldersTable;

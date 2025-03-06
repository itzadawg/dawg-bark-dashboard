
import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';

type SortField = 'initial' | 'current' | 'balanceChange' | 'realizedPnL' | null;

const TableHeader: React.FC = () => {
  const { sortField, sortDirection, handleSort } = useDashboard();

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={16} />;
    if (sortDirection === 'asc') return <ArrowUp size={16} />;
    if (sortDirection === 'desc') return <ArrowDown size={16} />;
    return <ArrowUpDown size={16} />;
  };

  const getSortableHeaderClass = (field: SortField) => {
    return `py-4 px-2 font-bold cursor-pointer select-none hover:bg-dawg-secondary/50 transition-colors flex items-center gap-1 ${sortField === field ? 'text-dawg-accent' : ''}`;
  };

  return (
    <tr className="bg-dawg neo-brutal-border">
      <th className="text-left py-4 px-2 font-bold w-[20%]">Name</th>
      <th className="text-left py-4 px-2 font-bold w-[15%]">Address</th>
      <th 
        className={`${getSortableHeaderClass('initial')} w-[13%]`}
        onClick={() => handleSort('initial')}
      >
        Initial {renderSortIcon('initial')}
      </th>
      <th 
        className={`${getSortableHeaderClass('current')} w-[13%]`}
        onClick={() => handleSort('current')}
      >
        Current balance {renderSortIcon('current')}
      </th>
      <th 
        className={`${getSortableHeaderClass('balanceChange')} w-[13%]`}
        onClick={() => handleSort('balanceChange')}
      >
        Balance Change {renderSortIcon('balanceChange')}
      </th>
      <th className="text-left py-4 px-2 font-bold w-[11%]">Activity</th>
      <th 
        className={`${getSortableHeaderClass('realizedPnL')} w-[15%]`}
        onClick={() => handleSort('realizedPnL')}
      >
        Realized PnL {renderSortIcon('realizedPnL')}
      </th>
    </tr>
  );
};

export default TableHeader;

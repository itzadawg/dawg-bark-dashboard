import React from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { ChevronUp, ChevronDown, ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from '@/lib/utils';

type ActivityLevel = 'none' | 'low' | 'medium' | 'high';

type TableData = {
  id: number;
  name: string;
  username: string;
  address: string;
  initial: string;
  current: string;
  balanceChange: string;
  activity: ActivityLevel;
  realizedPnL: string;
  avatar: string;
  emoji?: string;
};

const TableRow = ({ 
  data, 
  showMasked 
}: { 
  data: TableData; 
  showMasked: boolean;
}) => {
  const {
    name,
    username,
    address,
    initial,
    current,
    balanceChange,
    activity,
    realizedPnL,
    avatar,
    emoji
  } = data;

  const activityClass = activity === 'high' ? 'bg-green-500' : activity === 'medium' ? 'bg-yellow-500' : activity === 'low' ? 'bg-red-500' : 'bg-gray-300';
  const activityLabel = activity === 'high' ? 'High' : activity === 'medium' ? 'Medium' : activity === 'low' ? 'Low' : 'None';

  return (
    <div className="grid grid-cols-7 px-4 py-5 border-b">
      <div className="flex items-center space-x-3">
        <img src={avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
        <div>
          <div className="font-bold">{showMasked ? 'Fumbler' : name} {emoji}</div>
          <div className="text-sm opacity-50">@{username}</div>
        </div>
      </div>
      <div>{showMasked ? 'Fumbler' : address}</div>
      <div>{showMasked ? 'Fumbler' : initial}</div>
      <div>{showMasked ? 'Fumbler' : current}</div>
      <div className="flex items-center">
        {showMasked ? 'Fumbler' : balanceChange}
        {balanceChange?.includes('-') ? <ArrowDownRight className="ml-1 w-4 h-4 text-red-500" /> : <ArrowUpRight className="ml-1 w-4 h-4 text-green-500" />}
      </div>
      <div className="flex items-center">
        <span className={cn("w-3 h-3 rounded-full mr-2", activityClass)}></span>
        {activityLabel}
      </div>
      <div>{showMasked ? 'Fumbler' : realizedPnL}</div>
    </div>
  );
};

const TableHeader = ({ field, label }: { field: string; label: string }) => {
  const { sortField, sortDirection, handleSort } = useDashboard();
  const isActive = sortField === field;
  const isAscending = isActive && sortDirection === 'asc';

  return (
    <div className="px-4 py-3 border-b bg-muted/40 cursor-pointer select-none" onClick={() => handleSort(field as any)}>
      <div className="flex items-center justify-between">
        {label}
        {isActive && (
          <>
            {isAscending ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </>
        )}
      </div>
    </div>
  );
};

// Main component
const HoldersTable = () => {
  const { showMasked } = useDashboard();
  const { sortField, sortDirection } = useDashboard();
  const { tableData } = useDashboard();

  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <div className="w-full overflow-hidden border rounded-lg bg-background shadow">
        <div className="p-4 border-b">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-7 px-4 py-3 border-b bg-muted/40">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-20" />
            ))}
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-7 px-4 py-5 border-b">
              {[...Array(7)].map((_, j) => (
                <Skeleton key={j} className="h-5 w-24" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate activity level
  const getActivityClass = (activity: ActivityLevel) => {
    if (activity === 'high') return 'bg-green-500';
    if (activity === 'medium') return 'bg-yellow-500';
    if (activity === 'low') return 'bg-red-500';
    return 'bg-gray-300';
  };

  const getActivityLabel = (activity: ActivityLevel) => {
    if (activity === 'high') return 'High';
    if (activity === 'medium') return 'Medium';
    if (activity === 'low') return 'Low';
    return 'None';
  };

  return (
    <div className="w-full overflow-hidden border rounded-lg bg-background shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Holders</h3>
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-7 px-4 py-3 font-bold text-sm">
          <TableHeader field="name" label="Name" />
          <TableHeader field="address" label="Address" />
          <TableHeader field="initial" label="Initial" />
          <TableHeader field="current" label="Current" />
          <TableHeader field="balanceChange" label="Balance Change" />
          <TableHeader field="activity" label="Activity" />
          <TableHeader field="realizedPnL" label="Realized P&L" />
        </div>
        {tableData.map((data) => (
          <TableRow key={data.id} data={data} showMasked={showMasked} />
        ))}
      </div>
    </div>
  );
};

export default HoldersTable;

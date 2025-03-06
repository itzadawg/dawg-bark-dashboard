
import React from 'react';
import { TrendingDown, DollarSign, BarChart3, Wallet } from 'lucide-react';

const StatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="neo-brutal-box bg-dawg-red/10 hover:bg-dawg-red/20 text-dawg-red p-5 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">Current price</div>
          <DollarSign size={20} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">$0.023</span>
            <div className="flex items-center">
              <TrendingDown size={18} />
              <span className="text-sm">-2.4%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="neo-brutal-box bg-dawg-light hover:bg-dawg-secondary p-5 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">Max allocation worth</div>
          <Wallet size={20} />
        </div>
        <div className="text-2xl font-bold">$2,300</div>
      </div>

      <div className="neo-brutal-box bg-dawg-light hover:bg-dawg-secondary p-5 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">Market Cap</div>
          <BarChart3 size={20} />
        </div>
        <div className="text-2xl font-bold">$2.3M</div>
      </div>

      <div className="neo-brutal-box bg-dawg-light hover:bg-dawg-secondary p-5 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">Liquidity</div>
          <DollarSign size={20} />
        </div>
        <div className="text-2xl font-bold">$450K</div>
      </div>
    </div>
  );
};

export default StatsCards;

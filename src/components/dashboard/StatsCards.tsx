
import React from 'react';
import { TrendingDown } from 'lucide-react';

const StatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="neo-brutal-box bg-dawg-red/10 hover:bg-dawg-red/20 text-dawg-red p-4 animate-fade-in">
        <div className="mb-1 text-sm">Current price</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold"></span>
            <div className="flex items-center">
              <TrendingDown size={18} />
              <span className="text-sm"></span>
            </div>
          </div>
          <div className="text-xl"></div>
        </div>
      </div>

      <div className="neo-brutal-box bg-dawg-light hover:bg-dawg-secondary p-4 animate-fade-in">
        <div className="mb-1 text-sm">Max allocation worth</div>
        <div className="text-2xl font-bold"></div>
      </div>

      <div className="neo-brutal-box bg-dawg-light hover:bg-dawg-secondary p-4 animate-fade-in">
        <div className="mb-1 text-sm">Market Cap</div>
        <div className="text-2xl font-bold"></div>
      </div>

      <div className="neo-brutal-box bg-dawg-light hover:bg-dawg-secondary p-4 animate-fade-in">
        <div className="mb-1 text-sm">Liquidity</div>
        <div className="text-2xl font-bold"></div>
      </div>
    </div>
  );
};

export default StatsCards;

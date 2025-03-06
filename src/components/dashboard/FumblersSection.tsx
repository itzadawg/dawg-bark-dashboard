
import React from 'react';
import FumblerCard from '../FumblerCard';
import { useDashboard, getDashboardData } from '../../contexts/DashboardContext';

const FumblersSection: React.FC = () => {
  const { visibleFumblers, animatingFumblers, handleToggleFumblers } = useDashboard();
  const { fumblers } = getDashboardData();

  return (
    <div className="neo-brutal-box bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Top Fumblers</h2>
          <p className="text-sm text-dawg-dark/70">Missed out on big gains</p>
        </div>
        <button 
          className="neo-brutal-button text-sm" 
          onClick={handleToggleFumblers}
          disabled={visibleFumblers >= fumblers.length && visibleFumblers <= 4}
        >
          {visibleFumblers > 4 ? "Show Less" : "Show More"}
        </button>
      </div>
      
      <div className="space-y-3">
        {fumblers.slice(0, visibleFumblers).map(fumbler => (
          <div 
            key={fumbler.id} 
            className={`transition-all duration-500 ${
              animatingFumblers.includes(fumbler.id) || fumbler.id <= 4 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <FumblerCard 
              name={fumbler.name} 
              amount={fumbler.amount} 
              avatar={fumbler.avatar} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FumblersSection;

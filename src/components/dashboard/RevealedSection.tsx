
import React from 'react';
import RevealedCard from '../RevealedCard';
import { useDashboard, getDashboardData } from '../../contexts/DashboardContext';

const RevealedSection: React.FC = () => {
  const { visibleRevealed, animatingRevealed, handleToggleRevealed } = useDashboard();
  const { revealed } = getDashboardData();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Recently revealed</h2>
          <p className="text-sm text-dawg-dark/70">Sold over 50% of their allocation</p>
        </div>
        <button 
          className="neo-brutal-button text-sm"
          onClick={handleToggleRevealed}
          disabled={visibleRevealed >= revealed.length && visibleRevealed <= 4}
        >
          {visibleRevealed > 4 ? "Show Less" : "Show More"}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {revealed.slice(0, visibleRevealed).map(item => (
          <div 
            key={item.id} 
            className={`transition-all duration-500 ${
              animatingRevealed.includes(item.id) || item.id <= 4 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <RevealedCard 
              name={item.name} 
              balance={item.balance} 
              percent={item.percent} 
              time={item.time} 
              avatar={item.avatar} 
              emoji={item.emoji} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevealedSection;

import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, DollarSign, TrendingDown, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import FumblerCard from '../components/FumblerCard';
import RevealedCard from '../components/RevealedCard';
import TableRow from '../components/TableRow';

type SortField = 'initial' | 'current' | 'balanceChange' | 'realizedPnL' | null;
type SortDirection = 'asc' | 'desc' | null;

const Index = () => {
  const [showMasked, setShowMasked] = useState(false);
  const [visibleFumblers, setVisibleFumblers] = useState(4);
  const [visibleRevealed, setVisibleRevealed] = useState(4);
  const [animatingFumblers, setAnimatingFumblers] = useState<number[]>([]);
  const [animatingRevealed, setAnimatingRevealed] = useState<number[]>([]);
  
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const fumblers = [{
    id: 1,
    name: '',
    amount: '',
    avatar: 'https://i.pravatar.cc/150?img=1'
  }, {
    id: 2,
    name: '',
    amount: '',
    avatar: 'https://i.pravatar.cc/150?img=2'
  }, {
    id: 3,
    name: '',
    amount: '',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }, {
    id: 4,
    name: '',
    amount: '',
    avatar: 'https://i.pravatar.cc/150?img=4'
  }, {
    id: 5,
    name: '',
    amount: '',
    avatar: 'https://i.pravatar.cc/150?img=5'
  }, {
    id: 6,
    name: '',
    amount: '',
    avatar: 'https://i.pravatar.cc/150?img=6'
  }, {
    id: 7,
    name: '',
    amount: '',
    avatar: 'https://i.pravatar.cc/150?img=7'
  }, {
    id: 8,
    name: '',
    amount: '',
    avatar: 'https://i.pravatar.cc/150?img=8'
  }, {
    id: 9,
    name: '',
    amount: '',
    avatar: 'https://i.pravatar.cc/150?img=9'
  }, {
    id: 10,
    name: '',
    amount: '',
    avatar: 'https://i.pravatar.cc/150?img=10'
  }];

  const revealed = [{
    id: 1,
    name: '',
    balance: '',
    percent: '',
    time: '',
    avatar: 'https://i.pravatar.cc/150?img=5'
  }, {
    id: 2,
    name: '',
    balance: '',
    percent: '',
    time: '',
    avatar: 'https://i.pravatar.cc/150?img=6',
    emoji: ''
  }, {
    id: 3,
    name: '',
    balance: '',
    percent: '',
    time: '',
    avatar: 'https://i.pravatar.cc/150?img=7',
    emoji: ''
  }, {
    id: 4,
    name: '',
    balance: '',
    percent: '',
    time: '',
    avatar: 'https://i.pravatar.cc/150?img=8',
    emoji: ''
  }, {
    id: 5,
    name: '',
    balance: '',
    percent: '',
    time: '',
    avatar: 'https://i.pravatar.cc/150?img=9',
    emoji: ''
  }, {
    id: 6,
    name: '',
    balance: '',
    percent: '',
    time: '',
    avatar: 'https://i.pravatar.cc/150?img=10',
    emoji: ''
  }, {
    id: 7,
    name: '',
    balance: '',
    percent: '',
    time: '',
    avatar: 'https://i.pravatar.cc/150?img=11',
    emoji: ''
  }, {
    id: 8,
    name: '',
    balance: '',
    percent: '',
    time: '',
    avatar: 'https://i.pravatar.cc/150?img=12',
    emoji: ''
  }];

  const tableData = [{
    id: 1,
    name: '',
    username: '',
    address: '',
    initial: '',
    current: '',
    balanceChange: '',
    activity: 'none' as const,
    realizedPnL: '',
    avatar: 'https://i.pravatar.cc/150?img=8',
    emoji: ''
  }, {
    id: 2,
    name: '',
    username: '',
    address: '',
    initial: '',
    current: '',
    balanceChange: '',
    activity: 'none' as const,
    realizedPnL: '',
    avatar: 'https://i.pravatar.cc/150?img=9',
    emoji: ''
  }, {
    id: 3,
    name: '',
    username: '',
    address: '',
    initial: '',
    current: '',
    balanceChange: '',
    activity: 'none' as const,
    realizedPnL: '',
    avatar: 'https://i.pravatar.cc/150?img=10',
    emoji: ''
  }, {
    id: 4,
    name: '',
    username: '',
    address: '',
    initial: '',
    current: '',
    balanceChange: '',
    activity: 'none' as const,
    realizedPnL: '',
    avatar: 'https://i.pravatar.cc/150?img=11'
  }, {
    id: 5,
    name: '',
    username: '',
    address: '',
    initial: '',
    current: '',
    balanceChange: '',
    activity: 'none' as const,
    realizedPnL: '',
    avatar: 'https://i.pravatar.cc/150?img=12',
    emoji: ''
  }];

  const handleToggleFumblers = () => {
    if (visibleFumblers > 4) {
      setAnimatingFumblers([]);
      setTimeout(() => {
        setVisibleFumblers(4);
      }, 50);
      return;
    }
    
    if (visibleFumblers >= fumblers.length) return;
    
    const newVisibleCount = Math.min(visibleFumblers + 6, fumblers.length);
    
    for (let i = visibleFumblers; i < newVisibleCount; i++) {
      setTimeout(() => {
        setAnimatingFumblers(prev => [...prev, fumblers[i].id]);
      }, (i - visibleFumblers) * 300);
    }
    
    setVisibleFumblers(newVisibleCount);
  };

  const handleToggleRevealed = () => {
    if (visibleRevealed > 4) {
      setAnimatingRevealed([]);
      setTimeout(() => {
        setVisibleRevealed(4);
      }, 50);
      return;
    }
    
    if (visibleRevealed >= revealed.length) return;
    
    const newVisibleCount = Math.min(visibleRevealed + 6, revealed.length);
    
    for (let i = visibleRevealed; i < newVisibleCount; i++) {
      setTimeout(() => {
        setAnimatingRevealed(prev => [...prev, revealed[i].id]);
      }, (i - visibleRevealed) * 300);
    }
    
    setVisibleRevealed(newVisibleCount);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={16} />;
    if (sortDirection === 'asc') return <ArrowUp size={16} />;
    if (sortDirection === 'desc') return <ArrowDown size={16} />;
    return <ArrowUpDown size={16} />;
  };

  const getSortableHeaderClass = (field: SortField) => {
    return `text-left py-4 px-2 font-bold cursor-pointer select-none hover:bg-dawg-secondary/50 transition-colors flex items-center gap-1 ${sortField === field ? 'text-dawg-accent' : ''}`;
  };

  return <div className="min-h-screen bg-dawg-light px-8 py-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-6 gap-8">
        <div className="col-span-6 lg:col-span-4 space-y-10 animate-slide-in">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 text-dawg">Dawg Shameboard</h1>
            <p className="text-dawg-dark/80 max-w-3xl">Use this board to monitor the people who were approved in the DAWG application process. In an effort to maintain transparency in the process, we are revealing those who sold over 50% of their allocation, and are tracking attempts to obscure trading patterns.</p>
          </div>

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

          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold">Top Fumblers</h2>
                <p className="text-sm text-dawg-dark/70">Missed out on big gains.</p>
              </div>
              <button 
                className="neo-brutal-button text-sm" 
                onClick={handleToggleFumblers}
                disabled={visibleFumblers >= fumblers.length && visibleFumblers <= 4}
              >
                {visibleFumblers > 4 ? "Show Less" : "Show More"}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input type="text" placeholder="Search by symbol, name or address" className="w-full pl-10 py-3 neo-brutal-border focus:outline-none focus:ring-2 focus:ring-dawg bg-white" />
          </div>

          <div className="overflow-x-auto neo-brutal-box p-0">
            <div className="flex justify-between items-center bg-dawg p-4 neo-brutal-border">
              <h2 className="text-xl font-bold">DAWG Holders</h2>
              <button className="flex items-center gap-2 neo-brutal-button bg-white hover:bg-dawg-light" onClick={() => setShowMasked(!showMasked)}>
                <AlertTriangle size={16} />
                <span>Show masked entries</span>
              </button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-dawg neo-brutal-border">
                  <th className="text-left py-4 px-2 font-bold w-[20%]">Name</th>
                  <th className="text-left py-4 px-2 font-bold w-[15%]">Address</th>
                  <th 
                    className={`w-[13%] ${getSortableHeaderClass('initial')}`}
                    onClick={() => handleSort('initial')}
                  >
                    Initial {renderSortIcon('initial')}
                  </th>
                  <th 
                    className={`w-[13%] ${getSortableHeaderClass('current')}`}
                    onClick={() => handleSort('current')}
                  >
                    Current balance {renderSortIcon('current')}
                  </th>
                  <th 
                    className={`w-[13%] ${getSortableHeaderClass('balanceChange')}`}
                    onClick={() => handleSort('balanceChange')}
                  >
                    Balance Change {renderSortIcon('balanceChange')}
                  </th>
                  <th className="text-left py-4 px-2 font-bold w-[11%]">Activity</th>
                  <th 
                    className={`w-[15%] ${getSortableHeaderClass('realizedPnL')}`}
                    onClick={() => handleSort('realizedPnL')}
                  >
                    Realized PnL {renderSortIcon('realizedPnL')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map(row => <TableRow key={row.id} name={row.name} username={row.username} address={row.address} initial={row.initial} current={row.current} balanceChange={row.balanceChange} activity={row.activity} realizedPnL={row.realizedPnL} avatar={row.avatar} emoji={row.emoji} />)}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-6 lg:col-span-2 flex justify-center lg:justify-end">
          
        </div>
      </div>
    </div>;
};
export default Index;

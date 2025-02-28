
import React, { useState } from 'react';
import { Search, AlertTriangle, DollarSign, TrendingDown } from 'lucide-react';
import FumblerCard from '../components/FumblerCard';
import RevealedCard from '../components/RevealedCard';
import TableRow from '../components/TableRow';

const Index = () => {
  const [showMasked, setShowMasked] = useState(false);

  // Sample data for our dashboard (with empty values)
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
  return <div className="min-h-screen bg-dawg-light px-8 py-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-6 gap-8">
        {/* Left content (5 columns) */}
        <div className="col-span-6 lg:col-span-4 space-y-10 animate-slide-in">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 text-dawg">Tracking Dawgs & Mini-Dawgs</h1>
            <p className="text-dawg-dark/80 max-w-3xl">
              Use this wall to monitor the people who were approved in the DAWG application process. In an
              effort to maintain transparency in the process, we are revealing those who sold over 50% of
              their allocation, and are tracking attempts to obscure trading patterns.
            </p>
          </div>

          {/* Price Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current Price Card */}
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

            {/* Max Allocation Card */}
            <div className="neo-brutal-box bg-dawg-light hover:bg-dawg-secondary p-4 animate-fade-in">
              <div className="mb-1 text-sm">Max allocation worth</div>
              <div className="text-2xl font-bold"></div>
            </div>

            {/* Market Cap Card */}
            <div className="neo-brutal-box bg-dawg-light hover:bg-dawg-secondary p-4 animate-fade-in">
              <div className="mb-1 text-sm">Market Cap</div>
              <div className="text-2xl font-bold"></div>
            </div>

            {/* Liquidity Card */}
            <div className="neo-brutal-box bg-dawg-light hover:bg-dawg-secondary p-4 animate-fade-in">
              <div className="mb-1 text-sm">Liquidity</div>
              <div className="text-2xl font-bold"></div>
            </div>
          </div>

          {/* Top Fumblers */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold">Top Fumblers</h2>
                <p className="text-sm text-dawg-dark/70">Missed out on big gains.</p>
              </div>
              <button className="neo-brutal-button text-sm">Show More</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fumblers.map(fumbler => <FumblerCard key={fumbler.id} name={fumbler.name} amount={fumbler.amount} avatar={fumbler.avatar} />)}
            </div>
          </div>

          {/* Recently Revealed */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold">Recently revealed</h2>
                <p className="text-sm text-dawg-dark/70">Sold over 50% of their allocation</p>
              </div>
              <button className="neo-brutal-button text-sm">Show More</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {revealed.map(item => <RevealedCard key={item.id} name={item.name} balance={item.balance} percent={item.percent} time={item.time} avatar={item.avatar} emoji={item.emoji} />)}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input type="text" placeholder="Search by symbol, name or address" className="w-full pl-10 py-3 neo-brutal-border focus:outline-none focus:ring-2 focus:ring-dawg bg-white" />
          </div>

          {/* Table */}
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
                  <th className="text-left py-4 px-2 font-bold">Name</th>
                  <th className="text-left py-4 px-2 font-bold">Address</th>
                  <th className="text-left py-4 px-2 font-bold">Initial ↕</th>
                  <th className="text-left py-4 px-2 font-bold">Current balance ↕</th>
                  <th className="text-left py-4 px-2 font-bold">Balance Change ↕</th>
                  <th className="text-left py-4 px-2 font-bold">Activity</th>
                  <th className="text-left py-4 px-2 font-bold">Realized PnL ↕</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map(row => <TableRow key={row.id} name={row.name} username={row.username} address={row.address} initial={row.initial} current={row.current} balanceChange={row.balanceChange} activity={row.activity} realizedPnL={row.realizedPnL} avatar={row.avatar} emoji={row.emoji} />)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right content (mascot image - 1 column) */}
        <div className="col-span-6 lg:col-span-2 flex justify-center lg:justify-end">
          
        </div>
      </div>
    </div>;
};
export default Index;

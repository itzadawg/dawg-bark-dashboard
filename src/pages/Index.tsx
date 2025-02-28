
import React, { useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import FumblerCard from '../components/FumblerCard';
import RevealedCard from '../components/RevealedCard';
import TableRow from '../components/TableRow';

const Index = () => {
  const [showMasked, setShowMasked] = useState(false);

  // Sample data for our dashboard
  const fumblers = [
    { id: 1, name: 'ntoine 9000', amount: '+142,434.45', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Masil (0,G)', amount: '+85,709.96', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: 'Retardo Masturbinio', amount: '+70,033.39', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 4, name: 'Galileo', amount: '+77,830.53', avatar: 'https://i.pravatar.cc/150?img=4' },
  ];

  const revealed = [
    { 
      id: 1, 
      name: 'Whomp', 
      balance: '700,000', 
      percent: '-52.32%', 
      time: 'an hour ago', 
      avatar: 'https://i.pravatar.cc/150?img=5' 
    },
    { 
      id: 2, 
      name: 'VirtualQuery', 
      balance: '725,000', 
      percent: '-50.61%', 
      time: '2 hours ago', 
      avatar: 'https://i.pravatar.cc/150?img=6',
      emoji: '🟡' 
    },
    { 
      id: 3, 
      name: 'chifuu', 
      balance: '388,745.95', 
      percent: '-7.32%', 
      time: '5 hours ago', 
      avatar: 'https://i.pravatar.cc/150?img=7',
      emoji: '▲' 
    },
    { 
      id: 4, 
      name: 'Emperor Osmo', 
      balance: '300,000.52', 
      percent: '-79.56%', 
      time: '9 hours ago', 
      avatar: 'https://i.pravatar.cc/150?img=8',
      emoji: '🐺 🚀' 
    },
  ];

  const tableData = [
    {
      id: 1,
      name: 'Emperor Osmo',
      username: '@EmperorOsmo',
      address: '0x2c0a...34ef',
      initial: '1,468,041',
      current: '300,000.52',
      balanceChange: '-79.56%',
      activity: 'none' as const,
      realizedPnL: '$0',
      avatar: 'https://i.pravatar.cc/150?img=8',
      emoji: '🐺 🚀'
    },
    {
      id: 2,
      name: 'gobelz',
      username: '@gobelz_',
      address: '0x96f8...6b8f',
      initial: '419,440',
      current: '0',
      balanceChange: '-100.00%',
      activity: 'medium' as const,
      realizedPnL: '$19,947.71',
      avatar: 'https://i.pravatar.cc/150?img=9',
      emoji: '🍕'
    },
    {
      id: 3,
      name: 'aihansu9000',
      username: '@Zenousmansesh',
      address: '0xd427...1b00',
      initial: '1,468,041',
      current: '1,705,550.76',
      balanceChange: '16.18%',
      activity: 'low' as const,
      realizedPnL: '$0',
      avatar: 'https://i.pravatar.cc/150?img=10',
      emoji: '👨‍💻 🌒 🔮'
    },
    {
      id: 4,
      name: 'Figurandy',
      username: '@figurandy',
      address: '0x1768...7c50',
      initial: '419,440',
      current: '48,650.94',
      balanceChange: '-88.40%',
      activity: 'medium' as const,
      realizedPnL: '$26,013.10',
      avatar: 'https://i.pravatar.cc/150?img=11'
    },
    {
      id: 5,
      name: 'minho',
      username: '@minhodm',
      address: '0x2616...f39b',
      initial: '419,440',
      current: '0',
      balanceChange: '-100.00%',
      activity: 'medium' as const,
      realizedPnL: '$19,808.52',
      avatar: 'https://i.pravatar.cc/150?img=12',
      emoji: '🌿'
    },
  ];

  return (
    <div className="min-h-screen bg-dawg-light px-8 py-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-6 gap-8">
        {/* Left content (5 columns) */}
        <div className="col-span-6 lg:col-span-4 space-y-10 animate-slide-in">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">Tracking Dawgs & Mini-Dawgs</h1>
            <p className="text-dawg-dark/80 max-w-3xl">
              Use this wall to monitor the people who were approved in the DAWG application process. In an
              effort to maintain transparency in the process, we are revealing those who sold over 50% of
              their allocation, and are tracking attempts to obscure trading patterns.
            </p>
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
              {fumblers.map(fumbler => (
                <FumblerCard 
                  key={fumbler.id}
                  name={fumbler.name}
                  amount={fumbler.amount}
                  avatar={fumbler.avatar}
                />
              ))}
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
              {revealed.map(item => (
                <RevealedCard 
                  key={item.id}
                  name={item.name}
                  balance={item.balance}
                  percent={item.percent}
                  time={item.time}
                  avatar={item.avatar}
                  emoji={item.emoji}
                />
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search by symbol, name or address"
              className="w-full pl-10 py-3 neo-brutal-border focus:outline-none focus:ring-2 focus:ring-dawg bg-white"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto neo-brutal-box p-0">
            <div className="flex justify-between items-center bg-dawg p-4 neo-brutal-border">
              <h2 className="text-xl font-bold">DAWG Holders</h2>
              <button 
                className="flex items-center gap-2 neo-brutal-button bg-white hover:bg-dawg-light"
                onClick={() => setShowMasked(!showMasked)}
              >
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

        {/* Right content (mascot image - 1 column) */}
        <div className="col-span-6 lg:col-span-2 flex justify-center lg:justify-end">
          <img 
            src="/lovable-uploads/cad422db-0b5b-4daa-8c69-399db79c934a.png" 
            alt="Dawg Mascot"
            className="w-48 h-48 object-contain animate-fade-in"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;

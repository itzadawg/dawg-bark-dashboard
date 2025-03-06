
import React, { createContext, useContext, useState, ReactNode } from 'react';

type SortField = 'initial' | 'current' | 'balanceChange' | 'realizedPnL' | null;
type SortDirection = 'asc' | 'desc' | null;

interface DashboardContextType {
  showMasked: boolean;
  setShowMasked: (value: boolean) => void;
  visibleFumblers: number;
  setVisibleFumblers: (value: number) => void;
  visibleRevealed: number;
  setVisibleRevealed: (value: number) => void;
  animatingFumblers: number[];
  setAnimatingFumblers: (value: number[]) => void;
  animatingRevealed: number[];
  setAnimatingRevealed: (value: number[]) => void;
  sortField: SortField;
  setSortField: (value: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (value: SortDirection) => void;
  handleSort: (field: SortField) => void;
  handleToggleFumblers: () => void;
  handleToggleRevealed: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showMasked, setShowMasked] = useState(false);
  const [visibleFumblers, setVisibleFumblers] = useState(4);
  const [visibleRevealed, setVisibleRevealed] = useState(4);
  const [animatingFumblers, setAnimatingFumblers] = useState<number[]>([]);
  const [animatingRevealed, setAnimatingRevealed] = useState<number[]>([]);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

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

  const handleToggleFumblers = () => {
    if (visibleFumblers > 4) {
      setAnimatingFumblers([]);
      setTimeout(() => {
        setVisibleFumblers(4);
      }, 50);
      return;
    }
    
    const fumblers = getDashboardData().fumblers;
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
    
    const revealed = getDashboardData().revealed;
    if (visibleRevealed >= revealed.length) return;
    
    const newVisibleCount = Math.min(visibleRevealed + 6, revealed.length);
    
    for (let i = visibleRevealed; i < newVisibleCount; i++) {
      setTimeout(() => {
        setAnimatingRevealed(prev => [...prev, revealed[i].id]);
      }, (i - visibleRevealed) * 300);
    }
    
    setVisibleRevealed(newVisibleCount);
  };

  return (
    <DashboardContext.Provider
      value={{
        showMasked,
        setShowMasked,
        visibleFumblers,
        setVisibleFumblers,
        visibleRevealed,
        setVisibleRevealed,
        animatingFumblers,
        setAnimatingFumblers,
        animatingRevealed,
        setAnimatingRevealed,
        sortField,
        setSortField,
        sortDirection,
        setSortDirection,
        handleSort,
        handleToggleFumblers,
        handleToggleRevealed
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// Mock data to be replaced with actual API calls later
export const getDashboardData = () => {
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

  return { fumblers, revealed, tableData };
};

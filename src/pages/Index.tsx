import React from 'react';
import { DashboardProvider } from '../contexts/DashboardContext';
import IntroSection from '../components/dashboard/IntroSection';
import StatsCards from '../components/dashboard/StatsCards';
import FumblersSection from '../components/dashboard/FumblersSection';
import RevealedSection from '../components/dashboard/RevealedSection';
import SearchBar from '../components/dashboard/SearchBar';
import HoldersTable from '../components/dashboard/HoldersTable';

const Index = () => {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-dawg-light px-8 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-6 gap-8">
          <div className="col-span-6 lg:col-span-4 space-y-10 animate-slide-in">
            <IntroSection />
            <StatsCards />
            <FumblersSection />
            <RevealedSection />
            <SearchBar />
            <HoldersTable />
          </div>

          <div className="col-span-6 lg:col-span-2 flex justify-center lg:justify-end">
            {/* Sidebar content, if any */}
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default Index;

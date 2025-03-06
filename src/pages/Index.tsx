
import React from 'react';
import { DashboardProvider } from '../contexts/DashboardContext';
import Header from '../components/dashboard/Header';
import IntroSection from '../components/dashboard/IntroSection';
import StatsCards from '../components/dashboard/StatsCards';
import FumblersSection from '../components/dashboard/FumblersSection';
import RevealedSection from '../components/dashboard/RevealedSection';
import SearchBar from '../components/dashboard/SearchBar';
import HoldersTable from '../components/dashboard/HoldersTable';

const Index = () => {
  return (
    <DashboardProvider>
      <Header />
      <div className="min-h-screen bg-dawg-light px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <IntroSection />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <StatsCards />
              <SearchBar />
              <HoldersTable />
            </div>

            <div className="lg:col-span-4 space-y-8">
              <FumblersSection />
              <RevealedSection />
            </div>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default Index;

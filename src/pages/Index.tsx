
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
      <div className="min-h-screen bg-dawg-light px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl mx-auto">
        <div className="space-y-6 sm:space-y-10 animate-slide-in">
          <IntroSection />
          <StatsCards />
          <FumblersSection />
          <RevealedSection />
          <div className="mb-4">
            <SearchBar />
          </div>
          <HoldersTable />
        </div>
      </div>
    </DashboardProvider>
  );
};

export default Index;

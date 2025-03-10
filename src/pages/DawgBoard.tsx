
import React from 'react';
import Header from '../components/dashboard/Header';
import LeaderboardTable from '../components/LeaderboardTable';
import { Toaster } from '../components/ui/sonner';

const DawgBoard = () => {
  return <>
      <Header />
      <div className="min-h-screen bg-dawg-light px-8 py-12 max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-black text-dawg-dark mb-4">DAWG Twitter Leaderboard</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See who's representing the DAWG community the most on Twitter!
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <LeaderboardTable />
          </div>
          
          <div className="bg-white p-6 rounded-lg neo-brutal-border max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">How it works</h2>
            <p className="mb-4">We track tweets containing $Dawg or @itzadawg and award points based on engagement:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="font-semibold">1 point</span> for each tweet mentioning DAWG</li>
              <li><span className="font-semibold">2 points</span> for each like your tweet receives</li>
              <li><span className="font-semibold">5 points</span> for each retweet your tweet receives</li>
              <li><span className="font-semibold">3 points</span> for each reply your tweet receives</li>
            </ul>
            <p className="mt-4">
              The leaderboard updates every minute. Keep tweeting to climb the ranks!
            </p>
          </div>
        </div>
      </div>
      <Toaster />
    </>;
};
export default DawgBoard;


import React from 'react';
import Header from '../components/dashboard/Header';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Calendar, ArrowRight } from 'lucide-react';

const Presale = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen px-4 md:px-8 py-12 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-dawg-dark mb-4">DAWG Presale</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get early access to the DAWG token before public launch
          </p>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-16 items-center">
          <div className="w-full md:w-1/2">
            <div className="neo-brutal-border overflow-hidden">
              <img 
                src="https://i.imghippo.com/files/vWPh5294lmg.webp" 
                alt="DAWG Token" 
                className="w-full h-auto"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <div className="neo-brutal-box p-6">
              <h2 className="text-2xl font-bold mb-4">Presale Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-bold">June 15, 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date:</span>
                  <span className="font-bold">July 15, 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Presale Price:</span>
                  <span className="font-bold">0.00025 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Purchase:</span>
                  <span className="font-bold">0.1 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Purchase:</span>
                  <span className="font-bold">10 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tokens Available:</span>
                  <span className="font-bold">10,000,000 DAWG</span>
                </div>
              </div>
            </div>
            <Button className="w-full py-6 text-lg neo-brutal-border bg-dawg hover:bg-dawg-secondary flex items-center justify-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Join Presale Now
            </Button>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Presale Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="neo-brutal-box p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Phase 1</h3>
                <Calendar className="text-dawg h-6 w-6" />
              </div>
              <p className="mb-2">Private Sale</p>
              <p className="text-sm text-gray-600">Invitation only for early supporters and community members</p>
            </div>
            <div className="neo-brutal-box p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Phase 2</h3>
                <Calendar className="text-dawg h-6 w-6" />
              </div>
              <p className="mb-2">Public Presale</p>
              <p className="text-sm text-gray-600">Open to all participants with bonuses for early buyers</p>
            </div>
            <div className="neo-brutal-box p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Phase 3</h3>
                <Calendar className="text-dawg h-6 w-6" />
              </div>
              <p className="mb-2">DEX Listing</p>
              <p className="text-sm text-gray-600">DAWG token available on decentralized exchanges</p>
            </div>
          </div>
        </div>

        {/* How to Participate */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Participate</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="neo-brutal-box p-6">
              <div className="text-2xl font-bold mb-4 flex items-center">
                <span className="bg-dawg w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white">1</span>
                Connect Wallet
              </div>
              <p className="text-gray-600">Link your MetaMask or other Web3 wallet to participate</p>
            </div>
            <div className="neo-brutal-box p-6">
              <div className="text-2xl font-bold mb-4 flex items-center">
                <span className="bg-dawg w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white">2</span>
                Enter Amount
              </div>
              <p className="text-gray-600">Choose how many DAWG tokens you want to purchase</p>
            </div>
            <div className="neo-brutal-box p-6">
              <div className="text-2xl font-bold mb-4 flex items-center">
                <span className="bg-dawg w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white">3</span>
                Confirm Transaction
              </div>
              <p className="text-gray-600">Approve the transaction in your wallet and receive your tokens</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="neo-brutal-border bg-dawg/10 p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to join the DAWG pack?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Don't miss out on this exclusive opportunity to get DAWG tokens at the lowest possible price before public launch
          </p>
          <Button className="py-6 px-8 text-lg neo-brutal-border bg-dawg hover:bg-dawg-secondary flex items-center justify-center gap-2 mx-auto">
            Participate in Presale <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Presale;

import React from 'react';
import Header from '../components/dashboard/Header';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowRight } from 'lucide-react';
const Presale = () => {
  return <>
      <Header />
      <div className="min-h-screen px-4 md:px-8 py-12 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-dawg-dark mb-4">DAWG Presale</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get early access to the DAWG token before public launch
          </p>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-16 items-start">
          <div className="w-full md:w-1/2">
            <div className="neo-brutal-border overflow-hidden">
              <img alt="DAWG Token" className="w-full h-auto" src="/lovable-uploads/a10d58f1-ba3c-4807-b77d-57792190f4fd.png" />
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
    </>;
};
export default Presale;
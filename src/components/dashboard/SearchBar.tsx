
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';

const SearchBar: React.FC = () => {
  return (
    <div className="neo-brutal-box bg-white p-4">
      <h2 className="text-xl font-bold mb-4">Find holders</h2>
      <div className="relative w-full flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input 
            type="text" 
            placeholder="Search by symbol, name or address" 
            className="w-full pl-10 py-3 neo-brutal-border focus:outline-none focus:ring-2 focus:ring-dawg bg-white" 
          />
        </div>
        <Button variant="default" className="neo-brutal-button">
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;

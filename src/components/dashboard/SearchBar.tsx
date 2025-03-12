
import React from 'react';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
  return (
    <div className="relative w-full mb-4">
      <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
      </div>
      <input 
        type="text" 
        placeholder="Search by symbol, name or address" 
        className="w-full pl-8 sm:pl-10 py-2 sm:py-3 text-sm sm:text-base neo-brutal-border focus:outline-none focus:ring-2 focus:ring-dawg bg-white" 
      />
    </div>
  );
};

export default SearchBar;

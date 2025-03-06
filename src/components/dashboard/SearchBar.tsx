
import React from 'react';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
  return (
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
  );
};

export default SearchBar;

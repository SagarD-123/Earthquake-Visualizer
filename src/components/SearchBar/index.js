import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

const SEARCH_SUGGESTIONS = [
  'North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania',
  'United States', 'Japan', 'Indonesia', 'Chile', 'Mexico', 'New Zealand',
  'Pacific Ring of Fire', 'Mediterranean', 'California', 'Alaska'
];

const SearchBar = ({ onSearch, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce the search callback
  const debouncedSearch = useCallback(
    debounce((term) => {
      if (term.length >= 3) {
        onSearch(term);
      } else if (term.length === 0) {
        onSearch('');
      }
    }, 500),
    [onSearch]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="w-full lg:w-96 relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          placeholder="Search locations (min. 3 characters)..."
          onChange={handleSearchChange}
          className={`w-full px-4 py-2 bg-white/90 backdrop-blur-md 
                   border border-gray-200/50 rounded-xl shadow-lg 
                   focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 
                   text-sm placeholder-gray-400
                   ${loading ? 'pr-10' : ''}`}
          disabled={loading}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar; 
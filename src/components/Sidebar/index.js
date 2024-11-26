import React, { useState, useEffect } from 'react';
import { TIME_RANGES, MAGNITUDE_RANGES } from '../../constants/mapConstants';

const Sidebar = ({ 
  earthquakes, 
  onMagnitudeChange, 
  onTimeRangeChange, 
  selectedTimeRange,
  sortOrder,
  onSortChange,
  onEarthquakeSelect,
  selectedMagnitudeRange,
  onSidebarToggle,
  loading = { filtering: false, sorting: false }
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'magnitude-high', label: 'Highest Magnitude' },
    { value: 'magnitude-low', label: 'Lowest Magnitude' }
  ];

  const sortEarthquakes = (earthquakes, sortOrder) => {
    return [...earthquakes].sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return b.properties.time - a.properties.time;
        case 'oldest':
          return a.properties.time - b.properties.time;
        case 'magnitude-high':
          if (!a.properties.mag) return 1;
          if (!b.properties.mag) return -1;
          return b.properties.mag - a.properties.mag;
        case 'magnitude-low':
          if (!a.properties.mag) return 1;
          if (!b.properties.mag) return -1;
          return a.properties.mag - b.properties.mag;
        default:
          return 0;
      }
    });
  };

  const sortedEarthquakes = sortEarthquakes(earthquakes, sortOrder);

  const handleToggle = (isOpen) => {
    setIsMobileOpen(isOpen);
    onSidebarToggle?.(isOpen);
  };

  const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="text-sm text-gray-600 mt-2">Loading...</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button 
          className="fixed top-4 left-4 z-[9999] p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => handleToggle(!isMobileOpen)}
          aria-label="Toggle sidebar"
        >
          <svg 
            className="w-6 h-6 text-gray-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
      )}

      {/* Sidebar Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9998] lg:hidden transition-opacity"
          onClick={() => handleToggle(false)}
        />
      )}

      {/* Sidebar Content */}
      <div 
        className={`
          fixed lg:relative top-0 left-0 h-full w-full lg:w-96 
          bg-white/95 backdrop-blur-md shadow-xl lg:shadow-none
          transform transition-transform duration-300 ease-in-out z-[9999]
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="relative h-screen w-full lg:w-96 bg-gradient-to-br from-white/95 to-gray-50/90 backdrop-blur-lg shadow-2xl flex flex-col border-r border-gray-200/30">
          {(loading.filtering || loading.sorting) && <LoadingOverlay />}
          {/* Close Button - only visible on mobile */}
          {isMobile && (
            <button
              onClick={() => handleToggle(false)}
              className="absolute top-4 right-4 z-50 
                        w-10 h-10 flex items-center justify-center
                        bg-white rounded-lg shadow-lg 
                        hover:bg-gray-50 
                        transition-all duration-300 ease-in-out
                        group"
              aria-label="Close sidebar"
            >
              <svg 
                className="w-6 h-6 text-gray-600 group-hover:text-gray-800 
                           transition-all duration-300 group-hover:rotate-180" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Header with animated gradient */}
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
            <div className="relative">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Earthquake Monitor
              </h1>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-500/10 rounded-full animate-pulse"></div>
              <p className="text-sm text-gray-600 mt-1">Real-time seismic activity tracker</p>
            </div>
          </div>

          {/* Collapsible Filter Section */}
          <div className="px-4 py-2 border-b border-gray-200/50 backdrop-blur-md">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="w-full flex items-center justify-between p-2 rounded-lg
                         bg-white/50 hover:bg-white/80 transition-all duration-300
                         group"
            >
              <div className="flex items-center gap-2">
                <svg 
                  className="w-5 h-5 text-blue-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span className="font-medium text-gray-700">Filters & Sort</span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  isFiltersOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Expandable Filter Content */}
            <div className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isFiltersOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}
            `}>
              <div className="space-y-3 p-2">
                {/* Sort Filter */}
                <div className="filter-group bg-white/50 backdrop-blur-sm rounded-lg p-2.5 shadow-sm hover:shadow-md transition-all duration-300">
                  <label className="text-xs font-medium text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    Sort By
                  </label>
                  <select 
                    onChange={(e) => onSortChange(e.target.value)}
                    value={sortOrder}
                    className="w-full px-2 py-1.5 mt-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Magnitude Filter */}
                <div className="filter-group bg-white/50 backdrop-blur-sm rounded-lg p-2.5 shadow-sm hover:shadow-md transition-all duration-300">
                  <label className="text-xs font-medium text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Magnitude
                  </label>
                  <select 
                    value={JSON.stringify(selectedMagnitudeRange)}
                    onChange={(e) => onMagnitudeChange(JSON.parse(e.target.value))}
                    className="w-full px-2 py-1.5 mt-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={JSON.stringify({ min: 0, max: Infinity })}>All Magnitudes</option>
                    {Object.entries(MAGNITUDE_RANGES).map(([key, range]) => (
                      <option key={key} value={JSON.stringify(range)}>
                        {range.min} - {range.max === Infinity ? '∞' : range.max}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time Filter */}
                <div className="filter-group bg-white/50 backdrop-blur-sm rounded-lg p-2.5 shadow-sm hover:shadow-md transition-all duration-300">
                  <label className="text-xs font-medium text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Time Range
                  </label>
                  <select 
                    value={selectedTimeRange}
                    onChange={(e) => onTimeRangeChange(Number(e.target.value))}
                    className="w-full px-2 py-1.5 mt-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {TIME_RANGES.map(({ label, value }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Earthquakes List with enhanced cards */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white/30 scrollbar-thin">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 4.5v15m0 0v-8.5a3.5 3.5 0 00-7 0V19m7 0a3.5 3.5 0 11-7 0m7 0v-8.5a3.5 3.5 0 00-7 0V19" />
                </svg>
                Recent Events
              </h2>
              <div className="space-y-3">
                {sortedEarthquakes.map((earthquake) => (
                  <div 
                    key={earthquake.id} 
                    className="group p-4 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-blue-50/50 hover:border-blue-200/50"
                    onClick={() => onEarthquakeSelect(earthquake)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full transition-all duration-300 group-hover:scale-110 ${
                        !earthquake.properties.mag ? 'bg-gray-100 text-gray-800 group-hover:bg-gray-200' :
                        earthquake.properties.mag >= 6 ? 'bg-red-100 text-red-800 group-hover:bg-red-200' :
                        earthquake.properties.mag >= 4 ? 'bg-orange-100 text-orange-800 group-hover:bg-orange-200' :
                        earthquake.properties.mag >= 2 ? 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200' :
                        'bg-green-100 text-green-800 group-hover:bg-green-200'
                      }`}>
                        M {earthquake.properties.mag ? earthquake.properties.mag.toFixed(1) : 'N/A'}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        {new Date(earthquake.properties.time).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 group-hover:text-gray-900">
                      {earthquake.properties.place}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 
import React from 'react';

const Statistics = ({ earthquakes, selectedEarthquake, loading }) => {
  const calculateStats = () => {
    const total = earthquakes.length;
    const avgMagnitude = earthquakes.reduce((acc, eq) => acc + eq.properties.mag, 0) / total;
    const maxMagnitude = Math.max(...earthquakes.map(eq => eq.properties.mag));
    const minMagnitude = Math.min(...earthquakes.map(eq => eq.properties.mag));
    
    const last24Hours = earthquakes.filter(eq => {
      const timeDiff = Date.now() - eq.properties.time;
      return timeDiff <= 86400000;
    }).length;

    return { total, avgMagnitude, maxMagnitude, minMagnitude, last24Hours };
  };

  const stats = calculateStats();

  // Add loading overlay for statistics
  const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="relative bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50">
      {loading && <LoadingOverlay />}
      <div className="p-2">
        <div className="flex items-center justify-between px-2 py-1">
          <h3 className="text-xs font-semibold text-gray-800">Statistics</h3>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-green-600 font-medium">LIVE</span>
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-1.5 p-1.5">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-3 hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
              <p className="text-xs text-blue-700 font-medium">Total Events</p>
            </div>
            <p className="text-2xl font-bold text-blue-800 mt-1">{stats.total}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-3 hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <p className="text-xs text-green-700 font-medium">Last 24h</p>
            </div>
            <p className="text-2xl font-bold text-green-800 mt-1">{stats.last24Hours}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-3 hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-xs text-purple-700 font-medium">Max Magnitude</p>
            </div>
            <p className="text-2xl font-bold text-purple-800 mt-1">{stats.maxMagnitude.toFixed(1)}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg p-3 hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              <p className="text-xs text-amber-700 font-medium">Avg Magnitude</p>
            </div>
            <p className="text-2xl font-bold text-amber-800 mt-1">{stats.avgMagnitude.toFixed(1)}</p>
          </div>
        </div>

        {selectedEarthquake && (
          <div className="mt-1.5 mx-1.5 mb-1">
            <div className="text-[10px] font-medium text-gray-500 px-1 mb-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Selected Event
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-blue-700">
                    M {selectedEarthquake.properties.mag.toFixed(1)}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium bg-white/50 px-2 py-0.5 rounded-full">
                  {new Date(selectedEarthquake.properties.time).toLocaleTimeString()}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-start gap-1">
                  <svg className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-[11px] leading-tight text-gray-600">
                    {selectedEarthquake.properties.place}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[10px] text-gray-500">
                    {new Date(selectedEarthquake.properties.time).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics; 
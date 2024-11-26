import React from 'react';
import { MAGNITUDE_COLORS, MAGNITUDE_RANGES } from '../../constants/mapConstants';

const Legend = () => {
  return (
    <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200/50 
                    transition-all duration-300 hover:shadow-xl w-64">
      <div className="flex items-center justify-between mb-3 border-b border-gray-200/50 pb-2">
        <h3 className="text-sm font-semibold text-gray-800">Magnitude Scale</h3>
        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
          Guide
        </span>
      </div>
      
      {Object.entries(MAGNITUDE_RANGES).map(([key, range]) => (
        <div key={key} className="flex items-center space-x-3 mb-2 p-1.5 rounded-lg hover:bg-gray-50 transition-all duration-200">
          <div className="flex items-center space-x-2">
            <span 
              className="w-4 h-4 rounded-full shadow-sm"
              style={{ backgroundColor: MAGNITUDE_COLORS[key] }}
            />
            <span className="text-xs text-gray-700 font-medium">
              {range.min} - {range.max === Infinity ? '∞' : range.max}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {key === 'minor' ? 'Minor' : 
             key === 'light' ? 'Light' :
             key === 'moderate' ? 'Moderate' :
             key === 'strong' ? 'Strong' : 'Major'}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
import React from 'react';
import { MAGNITUDE_RANGES, TIME_RANGES } from '../../constants/mapConstants';

const Filters = ({ onMagnitudeChange, onTimeRangeChange, selectedTimeRange, selectedMagnitudeRange }) => {
  return (
    <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-custom z-50 w-64">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Magnitude Range
          </label>
          <select 
            value={JSON.stringify(selectedMagnitudeRange)}
            onChange={(e) => onMagnitudeChange(JSON.parse(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={JSON.stringify({ min: 0, max: Infinity })}>All Magnitudes</option>
            {Object.entries(MAGNITUDE_RANGES).map(([key, range]) => (
              <option key={key} value={JSON.stringify(range)}>
                {range.min} - {range.max === Infinity ? '∞' : range.max}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Range
          </label>
          <select 
            value={selectedTimeRange}
            onChange={(e) => onTimeRangeChange(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
  );
};

export default Filters;
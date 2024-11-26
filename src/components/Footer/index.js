import React from 'react';

const Footer = () => {
  return (
    <div className="absolute bottom-0 right-0 p-4 text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-tl-lg z-50">
      <p>© {new Date().getFullYear()} Earthquake Monitor</p>
      <p className="text-xs">
        Data source: <a href="https://earthquake.usgs.gov" className="text-blue-600 hover:underline">USGS</a>
      </p>
    </div>
  );
};

export default Footer; 
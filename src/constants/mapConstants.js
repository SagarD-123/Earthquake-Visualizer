export const MAP_SETTINGS = {
    center: [20, 0],
    zoom: 2,
    minZoom: 2,
    maxZoom: 18
  };
  
  export const MAGNITUDE_COLORS = {
    minor: '#2ecc71',
    light: '#f1c40f',
    moderate: '#e67e22',
    major: '#e74c3c'
  };
  
  export const MAGNITUDE_RANGES = {
    minor: { min: 0, max: 2 },
    light: { min: 2, max: 4 },
    moderate: { min: 4, max: 6 },
    major: { min: 6, max: Infinity }
  };
  
  export const TIME_RANGES = [
    { label: '1 Hour', value: 3600000 },
    { label: '1 Day', value: 86400000 },
    { label: '7 Days', value: 604800000 },
    { label: '30 Days', value: 2592000000 }
  ];
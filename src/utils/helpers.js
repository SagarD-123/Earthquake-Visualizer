import { MAGNITUDE_COLORS } from '../constants/mapConstants';

export const getMarkerColor = (magnitude) => {
  if (magnitude >= 6) return '#DC2626'; // red-600
  if (magnitude >= 4) return '#EA580C'; // orange-600
  if (magnitude >= 2) return '#CA8A04'; // yellow-600
  return '#16A34A'; // green-600
};
  
  export const getMarkerSize = (magnitude) => {
    return Math.max(magnitude * 3, 6);
  };
  
  export const filterEarthquakesByTime = (earthquakes, timeRange) => {
    const now = Date.now();
    return earthquakes.filter(eq => (now - eq.properties.time) <= timeRange);
  };
  
  export const filterEarthquakesByMagnitude = (earthquakes, magnitudeRange) => {
    // Special case for "All" selection
    if (magnitudeRange.min === 0 && magnitudeRange.max === Infinity) {
      return earthquakes;
    }
    
    return earthquakes.filter(eq => {
      const magnitude = eq.properties.mag;
      return magnitude >= magnitudeRange.min && 
             (magnitudeRange.max === Infinity ? true : magnitude <= magnitudeRange.max);
    });
  };
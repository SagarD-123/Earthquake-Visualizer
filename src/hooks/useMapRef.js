import { useRef, useEffect } from 'react';
import { useMap } from 'react-leaflet';

export const useMapRef = () => {
  const mapRef = useRef(null);
  
  const MapController = () => {
    const map = useMap();
    
    useEffect(() => {
      mapRef.current = map;
    }, [map]);
    
    return null;
  };

  return { mapRef, MapController };
}; 
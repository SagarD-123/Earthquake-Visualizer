import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import axios from 'axios';
import { MAP_SETTINGS } from '../../constants/mapConstants';
import { getMarkerColor, getMarkerSize, filterEarthquakesByTime, filterEarthquakesByMagnitude } from '../../utils/helpers';
import Legend from '../Legend';
import SearchBar from '../SearchBar';
import Statistics from '../Statistics';
import 'leaflet/dist/leaflet.css';
import './styles.css';
import Sidebar from '../Sidebar';
import ErrorBoundary from '../ErrorBoundary';
import Header from '../Header';
import Footer from '../Footer';
import LoadingOverlay from '../LoadingOverlay';

const EarthquakeMap = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState({
    initial: true,
    filtering: false,
    searching: false,
    sorting: false
  });
  const [timeRange, setTimeRange] = useState(259200000); // 30 days default
  const [magnitudeRange, setMagnitudeRange] = useState({ min: 0, max: Infinity });
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const mapRef = useRef(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedEarthquake, setSelectedEarthquake] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        setLoading(prev => ({ ...prev, initial: true }));
        const response = await axios.get(
          'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
        );
        setEarthquakes(response.data.features);
      } catch (error) {
        console.error('Error fetching earthquake data:', error);
      } finally {
        setLoading(prev => ({ ...prev, initial: false }));
      }
    };

    fetchEarthquakes();
    const interval = setInterval(fetchEarthquakes, 300000);
    return () => clearInterval(interval);
  }, []);

  const filteredEarthquakes = earthquakes.filter(eq => {
    const timeFiltered = filterEarthquakesByTime([eq], timeRange).length > 0;
    const magnitudeFiltered = filterEarthquakesByMagnitude([eq], magnitudeRange).length > 0;
    return timeFiltered && magnitudeFiltered;
  });

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setIsSearchActive(false);
      setSearchResults([]);
      return;
    }

    if (searchTerm.length < 3) {
      return;
    }

    setLoading(prev => ({ ...prev, searching: true }));
    try {
      const searchTerms = searchTerm.toLowerCase().split(' ');
      
      const results = earthquakes.filter(eq => {
        const place = eq.properties.place?.toLowerCase() || '';
        return searchTerms.every(term => place.includes(term));
      });

      setSearchResults(results);
      setIsSearchActive(true);

      if (results.length > 0) {
        const firstResult = results[0];
        const { coordinates } = firstResult.geometry;
        mapRef.current?.setView([coordinates[1], coordinates[0]], 6);
      }
    } finally {
      setLoading(prev => ({ ...prev, searching: false }));
    }
  };

  const displayedEarthquakes = isSearchActive ? searchResults : filteredEarthquakes;

  const MapBoundsComponent = () => {
    const map = useMap();
    
    useEffect(() => {
      // Set maximum bounds for the map
      const southWest = L.latLng(-90, -180);
      const northEast = L.latLng(90, 180);
      const bounds = L.latLngBounds(southWest, northEast);
      
      map.setMaxBounds(bounds);
      map.on('drag', () => {
        map.panInsideBounds(bounds, { animate: false });
      });
    }, [map]);

    return null;
  };

  const handleEarthquakeSelect = (earthquake) => {
    const { coordinates } = earthquake.geometry;
    const lng = ((coordinates[0] + 180) % 360) - 180;
    mapRef.current?.setView([coordinates[1], lng], 8);
    setSelectedEarthquake(earthquake);
  };

  const renderCircleMarkers = (earthquake, isSelected = false) => {
    const { coordinates } = earthquake.geometry;
    const baseLng = coordinates[0];
    const markers = [];
    
    // Render markers across multiple world copies
    for (let offset = -1; offset <= 1; offset++) {
      const lng = baseLng + (offset * 360);
      markers.push(
        <CircleMarker
          key={`${earthquake.id}-${offset}`}
          center={[coordinates[1], lng]}
          radius={getMarkerSize(earthquake.properties.mag) * (isSelected ? 2 : 1)}
          pathOptions={{
            fillColor: isSelected ? '#3B82F6' : getMarkerColor(earthquake.properties.mag),
            color: isSelected ? '#1D4ED8' : getMarkerColor(earthquake.properties.mag),
            weight: isSelected ? 3 : 1,
            opacity: 1,
            fillOpacity: isSelected ? 0.9 : 0.6,
            className: isSelected ? 'selected-marker' : ''
          }}
          eventHandlers={{
            click: () => setSelectedEarthquake(earthquake)
          }}
        >
          <Popup onClose={() => setSelectedEarthquake(null)}>
            <div className="p-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Magnitude: {earthquake.properties.mag}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                Location: {earthquake.properties.place}
              </p>
              <p className="text-sm text-gray-600">
                Time: {new Date(earthquake.properties.time).toLocaleString()}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      );
    }
    return markers;
  };

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  const handleTimeRangeChange = (newTimeRange) => {
    setLoading(prev => ({ ...prev, filtering: true }));
    setTimeout(() => {
      setTimeRange(newTimeRange);
      setLoading(prev => ({ ...prev, filtering: false }));
    }, 500);
  };

  const handleMagnitudeChange = (newMagnitudeRange) => {
    setLoading(prev => ({ ...prev, filtering: true }));
    setTimeout(() => {
      setMagnitudeRange(newMagnitudeRange);
      setLoading(prev => ({ ...prev, filtering: false }));
    }, 500);
  };

  const handleSortChange = (newSortOrder) => {
    setLoading(prev => ({ ...prev, sorting: true }));
    setTimeout(() => {
      setSortOrder(newSortOrder);
      setLoading(prev => ({ ...prev, sorting: false }));
    }, 500);
  };

  if (loading.initial) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="text-xl text-gray-700">Loading earthquake data...</p>
          <p className="text-sm text-gray-500">This may take a few moments</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="relative h-screen w-screen overflow-hidden flex">
        {(loading.filtering || loading.sorting || loading.searching) && (
          <LoadingOverlay 
            message={
              loading.filtering ? "Updating filters..." :
              loading.sorting ? "Sorting earthquakes..." :
              "Searching locations..."
            }
          />
        )}
        
        <Sidebar 
          earthquakes={displayedEarthquakes}
          onMagnitudeChange={handleMagnitudeChange}
          onTimeRangeChange={handleTimeRangeChange}
          selectedTimeRange={timeRange}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onEarthquakeSelect={handleEarthquakeSelect}
          selectedEarthquake={selectedEarthquake}
          onSidebarToggle={handleSidebarToggle}
          loading={loading}
        />

        <div className="flex-1 relative">
          <MapContainer
            ref={mapRef}
            center={MAP_SETTINGS.center}
            zoom={MAP_SETTINGS.zoom}
            minZoom={MAP_SETTINGS.minZoom}
            maxZoom={MAP_SETTINGS.maxZoom}
            className="h-full w-full"
            zoomControl={!isMobile}
            worldCopyJump={true}
          >
            <MapBoundsComponent />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              noWrap={false}
            />
            
            <MarkerClusterGroup
              chunkedLoading
              spiderfyOnMaxZoom={true}
              showCoverageOnHover={false}
              maxClusterRadius={50}
              disableClusteringAtZoom={8}
              zIndexOffset={0}
            >
              {displayedEarthquakes
                .filter(earthquake => selectedEarthquake?.id !== earthquake.id)
                .map(earthquake => renderCircleMarkers(earthquake))}

              {selectedEarthquake && renderCircleMarkers(selectedEarthquake, true)}
            </MarkerClusterGroup>
          </MapContainer>

          <div className={`${isSidebarOpen && isMobile ? 'hidden' : 'block'}`}>
            <div className="absolute top-4 lg:top-6 
                            left-16 lg:left-auto 
                            right-4 lg:right-6 
                            z-[1000]
                            lg:max-w-md">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 lg:right-auto lg:w-80 z-[1000]">
              <Statistics 
                earthquakes={displayedEarthquakes} 
                selectedEarthquake={selectedEarthquake}
              />
            </div>
            
            <div className="absolute bottom-4 right-4 z-[1000] hidden lg:block">
              <Legend />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default EarthquakeMap;
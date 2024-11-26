import React from 'react';
import EarthquakeMap from './components/EarthquakeMap';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <EarthquakeMap />
    </div>
  );
}

export default App;
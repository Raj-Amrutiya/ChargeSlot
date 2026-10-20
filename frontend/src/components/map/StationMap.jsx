import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Zap, MapPin, ArrowRight } from 'lucide-react';

// Fix Leaflet's default icon missing issue in Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;

// Custom Green EV Pin Icon
const createStationIcon = (isSelected = false) => {
  return L.divIcon({
    className: 'custom-ev-pin',
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: ${isSelected ? '#0F172A' : '#16A34A'};
        border: 2px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg style="transform: rotate(45deg); width: 18px; height: 18px; fill: white;" viewBox="0 0 24 24">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

// Helper component to smoothly center map when selected station changes
const MapCenterUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
};

const StationMap = ({ stations = [], selectedStation = null, onSelectStation = null, height = 'h-[500px]' }) => {
  // Default coordinates centered on Ahmedabad
  const defaultCenter = [23.0338, 72.585];
  const center =
    selectedStation?.location?.coordinates
      ? [selectedStation.location.coordinates[1], selectedStation.location.coordinates[0]]
      : stations.length > 0 && stations[0].location?.coordinates
      ? [stations[0].location.coordinates[1], stations[0].location.coordinates[0]]
      : defaultCenter;

  return (
    <div className={`w-full ${height} rounded-2xl overflow-hidden border border-slate-200 shadow-soft relative z-10`}>
      <MapContainer
        center={center}
        zoom={selectedStation ? 14 : 12}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <MapCenterUpdater center={center} zoom={selectedStation ? 14 : 12} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {stations.map((station) => {
          if (!station.location?.coordinates || station.location.coordinates.length < 2) return null;
          const pos = [station.location.coordinates[1], station.location.coordinates[0]];
          const isSelected = selectedStation?._id === station._id;

          return (
            <Marker
              key={station._id}
              position={pos}
              icon={createStationIcon(isSelected)}
              eventHandlers={{
                click: () => {
                  if (onSelectStation) onSelectStation(station);
                },
              }}
            >
              <Popup>
                <div className="w-56 p-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 mb-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>₹{station.pricePerKwh} / kWh</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{station.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
                    <span>{station.address}, {station.city}</span>
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {station.availableConnectors || 0} / {station.totalConnectors || 0} available
                    </span>
                    <Link
                      to={`/stations/${station._id}`}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-0.5"
                    >
                      Book <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default StationMap;

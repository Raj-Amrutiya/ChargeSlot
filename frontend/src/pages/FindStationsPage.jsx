import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Zap,
  Clock,
  Layers,
  ArrowRight,
  SlidersHorizontal,
  Map as MapIcon,
  List,
} from 'lucide-react';
import api from '../services/api';
import StationMap from '../components/map/StationMap';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';

const FindStationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || '';

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialCity);
  const [selectedConnector, setSelectedConnector] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  const [viewMode, setViewMode] = useState('both'); // 'both' on desktop, or toggle 'list' | 'map' on mobile

  const fetchStations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedConnector) params.connectorType = selectedConnector;
      if (maxPrice) params.maxPrice = maxPrice;

      const { data } = await api.get('/stations', { params });
      if (data.success) {
        setStations(data.data);
        if (data.data.length > 0) {
          setSelectedStation(data.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching stations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, [selectedConnector, maxPrice]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStations();
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedConnector('');
    setMaxPrice('');
    setSearchParams({});
    fetchStations();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Station Finder
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-0.5">
            Find Charging Stations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Showing {stations.length} verified EV charging hubs across Gujarat and nearby corridors
          </p>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex sm:hidden bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            Map
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by station name, address, or city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-xs sm:text-sm outline-none"
            />
          </div>

          {/* Connector Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedConnector}
              onChange={(e) => setSelectedConnector(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-xs sm:text-sm outline-none bg-white text-slate-700"
            >
              <option value="">All Connectors</option>
              <option value="CCS2">CCS2 (DC Fast)</option>
              <option value="Type 2">Type 2 (AC Fast)</option>
              <option value="CHAdeMO">CHAdeMO</option>
            </select>
          </div>

          {/* Max Price Filter */}
          <div className="w-full md:w-44">
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-xs sm:text-sm outline-none bg-white text-slate-700"
            >
              <option value="">Any Price</option>
              <option value="16">Under ₹16 / kWh</option>
              <option value="18">Under ₹18 / kWh</option>
              <option value="20">Under ₹20 / kWh</option>
              <option value="25">Under ₹25 / kWh</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
          >
            Apply
          </button>

          {(search || selectedConnector || maxPrice) && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold hover:bg-slate-100 transition"
            >
              Reset
            </button>
          )}
        </form>
      </div>

      {/* Main Content Area: Split List & Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stations List Column */}
        <div
          className={`lg:col-span-6 xl:col-span-7 space-y-4 ${
            viewMode === 'map' ? 'hidden sm:block' : 'block'
          }`}
        >
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton.StationCard key={i} />
              ))}
            </div>
          ) : stations.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No charging stations found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No active stations match your search query or filter criteria. Try loosening your filters.
              </p>
              <button
                onClick={clearFilters}
                className="mt-2 text-xs font-bold text-brand-600 hover:text-brand-700"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            stations.map((station) => {
              const isSelected = selectedStation?._id === station._id;
              return (
                <div
                  key={station._id}
                  onClick={() => setSelectedStation(station)}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border transition cursor-pointer flex flex-col sm:flex-row gap-4 ${
                    isSelected
                      ? 'border-brand-500 ring-2 ring-brand-500/10 shadow-md'
                      : 'border-slate-200/80 hover:border-slate-300 hover:shadow-soft'
                  }`}
                >
                  <img
                    src={station.imageUrl}
                    alt={station.name}
                    className="w-full sm:w-36 h-36 rounded-xl object-cover shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-slate-900 text-base leading-snug">
                          {station.name}
                        </h3>
                        <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full shrink-0">
                          ₹{station.pricePerKwh} / kWh
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {station.address}, {station.city}
                        </span>
                      </p>

                      {/* Connectors info */}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {station.availableConnectors || 0} / {station.totalConnectors || 0} Connectors Available
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Power: {station.maxPowerKw || 60} kW
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {station.connectorTypes?.map((type) => (
                          <span
                            key={type}
                            className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Hours: {station.openingTime} - {station.closingTime}
                      </span>
                      <Link
                        to={`/stations/${station._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1"
                      >
                        Book Slot
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Map Column */}
        <div
          className={`lg:col-span-6 xl:col-span-5 ${
            viewMode === 'list' ? 'hidden sm:block' : 'block'
          }`}
        >
          <div className="sticky top-20">
            <StationMap
              stations={stations}
              selectedStation={selectedStation}
              onSelectStation={(s) => setSelectedStation(s)}
              height="h-[600px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindStationsPage;

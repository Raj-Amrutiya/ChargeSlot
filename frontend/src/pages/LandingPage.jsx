import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  BatteryCharging,
  Sparkles,
  ChevronRight,
  Search,
} from 'lucide-react';
import api from '../services/api';

const LandingPage = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const { data } = await api.get('/stations?limit=4');
        if (data.success) {
          setStations(data.data);
        }
      } catch (err) {
        console.error('Error fetching stations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveStats();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      navigate(`/stations?city=${encodeURIComponent(searchCity.trim())}`);
    } else {
      navigate('/stations');
    }
  };

  const totalConnectors = stations.reduce((acc, s) => acc + (s.totalConnectors || 0), 0);
  const totalAvailable = stations.reduce((acc, s) => acc + (s.availableConnectors || 0), 0);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-brand-800 text-xs font-semibold ring-1 ring-brand-600/20 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-pulse" />
                <span>Next-Gen EV Charging Network • Gujarat Grid</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-[1.15]">
                Your next charge,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-500">
                  just a few clicks away.
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Find charging stations, verify connector availability in real-time, and reserve your charging time without waiting in queues.
              </p>

              {/* Quick Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-card border border-slate-200/80 flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto lg:mx-0"
              >
                <div className="flex items-center gap-2.5 px-3 flex-1 w-full">
                  <MapPin className="w-5 h-5 text-brand-600 shrink-0" />
                  <input
                    type="text"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    placeholder="Enter city (e.g. Ahmedabad, Gandhinagar)..."
                    className="w-full text-sm outline-none bg-transparent text-slate-800 placeholder-slate-400 py-1"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/20 hover:shadow-lg transition flex items-center justify-center gap-2 shrink-0"
                >
                  <Search className="w-4 h-4" />
                  Find Stations
                </button>
              </form>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/stations"
                  className="px-6 py-3.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm shadow hover:shadow-md transition flex items-center gap-2"
                >
                  Browse Map Directory
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-sm transition"
                >
                  Create Account
                </Link>
              </div>

              {/* Live Availability Metric Badge */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping"></span>
                  <span className="font-semibold text-slate-700">
                    {stations.length} Active Stations
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BatteryCharging className="w-4 h-4 text-brand-600" />
                  <span>
                    <strong className="text-slate-800">{totalAvailable}</strong> / {totalConnectors} Connectors Available Now
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main EV Graphic Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80"
                    alt="Electric Vehicle Charging at ChargeSlot Hub"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs uppercase tracking-wider font-bold text-brand-400">
                      Live Network Node
                    </span>
                    <h3 className="text-xl font-bold mt-1">Central EV Charging Hub</h3>
                    <p className="text-xs text-slate-200 mt-1">Vastrapur, Ahmedabad • 60kW & 120kW DC Fast</p>
                  </div>
                </div>

                {/* Floating Micro Card 1 */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-card border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-brand-700 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Zero Overlaps</p>
                    <p className="text-[11px] text-slate-500">Atomic reservation lock</p>
                  </div>
                </div>

                {/* Floating Micro Card 2 */}
                <div className="absolute -top-4 -right-4 bg-navy-900 text-white p-3.5 rounded-2xl shadow-card border border-slate-800 flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-brand-400 fill-current" />
                  <span className="text-xs font-bold">Fast CCS2 & Type 2 Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">
              Simple 3-Step Process
            </h2>
            <p className="text-3xl font-extrabold text-navy-900">
              How ChargeSlot Works
            </p>
            <p className="text-slate-600 text-sm mt-3">
              Reserve an electric vehicle charging slot in under 60 seconds with total confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative group hover:border-brand-300 hover:shadow-soft transition">
              <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg mb-6 shadow-md shadow-brand-600/20">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Find Stations</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Browse nearby charging stations on the interactive map. Filter by connector type (CCS2, Type 2, CHAdeMO) and power capacity.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative group hover:border-brand-300 hover:shadow-soft transition">
              <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg mb-6 shadow-md shadow-brand-600/20">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Book Slot</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Select your preferred date, hour, and specific connector. Our system verifies live availability and locks the slot atomically.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative group hover:border-brand-300 hover:shadow-soft transition">
              <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg mb-6 shadow-md shadow-brand-600/20">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Plug In & Charge</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Arrive at the station, present your digital booking code, connect your EV, and charge seamlessly with guaranteed reserved capacity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stations from Backend */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">
                Live Network Directory
              </h2>
              <p className="text-3xl font-extrabold text-navy-900">
                Popular Charging Stations
              </p>
              <p className="text-slate-600 text-sm mt-1">
                Real-time MongoDB documents served by our Express REST API.
              </p>
            </div>
            <Link
              to="/stations"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              View all stations <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stations.map((station) => (
              <div
                key={station._id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition group flex flex-col"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={station.imageUrl}
                    alt={station.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
                    <Zap className="w-3 h-3 text-brand-600 fill-current" />
                    ₹{station.pricePerKwh} / kWh
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition truncate">
                      {station.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{station.city}</span>
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {station.availableConnectors || 0} / {station.totalConnectors || 0} Available
                      </span>
                      <span className="text-xs text-slate-500">
                        Up to {station.maxPowerKw || 60} kW
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {station.openingTime} - {station.closingTime}
                    </span>
                    <Link
                      to={`/stations/${station._id}`}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-0.5"
                    >
                      View & Book <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

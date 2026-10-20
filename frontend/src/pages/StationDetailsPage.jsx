import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Zap,
  Coffee,
  Wifi,
  ShieldCheck,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  BatteryCharging,
} from 'lucide-react';
import api from '../services/api';
import Badge from '../components/common/Badge';
import StationMap from '../components/map/StationMap';

import Skeleton from '../components/common/Skeleton';

const StationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [station, setStation] = useState(null);
  const [connectors, setConnectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availability, setAvailability] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedConnectorId, setSelectedConnectorId] = useState('');

  // 1. Fetch Station Details
  useEffect(() => {
    const fetchStation = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/stations/${id}`);
        if (data.success) {
          setStation(data.data);
          setConnectors(data.data.connectors || []);
          if (data.data.connectors?.length > 0) {
            setSelectedConnectorId(data.data.connectors[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching station:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStation();
  }, [id]);

  // 2. Fetch Availability Slots for Selected Date
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!id) return;
      setSlotsLoading(true);
      try {
        const { data } = await api.get(`/stations/${id}/availability`, {
          params: { date: selectedDate },
        });
        if (data.success) {
          setAvailability(data.data);
          setSelectedSlot(null);
        }
      } catch (err) {
        console.error('Error fetching slots:', err);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchAvailability();
  }, [id, selectedDate]);

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton.StationHero />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <Skeleton.StationDetailCard />
            <Skeleton.ConnectorCard />
            <div className="h-72 bg-slate-200 animate-pulse rounded-2xl" />
          </div>
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-6 animate-pulse">
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-24" />
                <div className="h-6 bg-slate-200 rounded w-48" />
                <div className="h-3 bg-slate-200 rounded w-56" />
              </div>
              <div className="h-10 bg-slate-200 rounded-xl" />
              <Skeleton.SlotGrid count={12} />
              <div className="h-12 bg-slate-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Station Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          The charging station you requested could not be located or has been archived.
        </p>
        <Link
          to="/stations"
          className="mt-4 inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Directory
        </Link>
      </div>
    );
  }

  const handleProceedToCheckout = () => {
    if (!selectedSlot) return;

    // Check connector selection
    const connId = selectedConnectorId || selectedSlot.availableConnectors[0]?._id;
    if (!connId) return;

    navigate(
      `/book/${station._id}?connectorId=${connId}&startTime=${encodeURIComponent(
        selectedSlot.startTime
      )}&endTime=${encodeURIComponent(selectedSlot.endTime)}`
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-soft bg-white">
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={station.imageUrl}
            alt={station.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge status={station.status} />
              <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full font-medium">
                ₹{station.pricePerKwh} / kWh
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {station.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
              {station.address}, {station.city} - {station.postalCode}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Details, Amenities, Connectors */}
        <div className="lg:col-span-7 space-y-6">
          {/* Overview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">About this station</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {station.description ||
                'Modern high-reliability electric vehicle charging station supporting multi-standard fast charging.'}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">
                  Operating Hours
                </span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                  {station.openingTime} - {station.closingTime} Daily
                </span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">
                  Configured Price
                </span>
                <span className="font-semibold text-brand-700 flex items-center gap-1.5 mt-0.5">
                  <Zap className="w-3.5 h-3.5" />₹{station.pricePerKwh} per kWh
                </span>
              </div>
            </div>

            {/* Amenities */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-slate-400 block uppercase font-bold text-[10px] mb-2">
                Available Amenities
              </span>
              <div className="flex flex-wrap gap-2">
                {station.amenities?.map((amenity) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-brand-600" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Connectors List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Charging Connectors</h3>
              <span className="text-xs font-semibold text-slate-500">
                {connectors.length} Total Units
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {connectors.map((c) => (
                <div
                  key={c._id}
                  onClick={() => setSelectedConnectorId(c._id)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    selectedConnectorId === c._id
                      ? 'border-brand-500 bg-brand-50/40 ring-1 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                      <Zap className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{c.label}</h4>
                      <p className="text-xs text-slate-500">
                        {c.type} • {c.powerKw} kW
                      </p>
                    </div>
                  </div>
                  <Badge status={c.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Mini Station Map */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-base">Location on Map</h3>
            <StationMap stations={[station]} selectedStation={station} height="h-[280px]" />
          </div>
        </div>

        {/* Right Column: Interactive Real-Time Slot Picker */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card sticky top-20 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Live Reservation
              </span>
              <h3 className="text-xl font-extrabold text-navy-900 mt-0.5">
                Reserve Charging Slot
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select your preferred date and slot to lock in your charging session.
              </p>
            </div>

            {/* Date Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-sm font-semibold text-slate-800 outline-none"
                />
              </div>
            </div>

            {/* Slots Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Available Slots
                </label>
                <span className="text-[11px] text-slate-400 font-medium">1-hour intervals</span>
              </div>

              {slotsLoading ? (
                <Skeleton.SlotGrid count={12} />
              ) : !availability?.slots || availability.slots.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No slots configured for this date.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {availability.slots.map((slot) => {
                    const isSelected = selectedSlot?.slotLabel === slot.slotLabel;
                    return (
                      <button
                        key={slot.slotLabel}
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                          !slot.isAvailable
                            ? 'bg-slate-50 text-slate-300 border-slate-200/60 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-brand-600 text-white border-brand-600 shadow-md ring-2 ring-brand-600/20'
                            : 'bg-white hover:border-brand-400 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className="text-xs font-bold">{slot.slotLabel}</span>
                        <span
                          className={`text-[10px] mt-1 font-medium ${
                            isSelected
                              ? 'text-brand-100'
                              : slot.isAvailable
                              ? 'text-emerald-600'
                              : 'text-slate-400'
                          }`}
                        >
                          {slot.isAvailable
                            ? `${slot.availableCount} of ${slot.totalConnectors} left`
                            : 'Fully Booked'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Slot Summary & Checkout Action */}
            {selectedSlot && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Selected Slot:</span>
                  <span className="font-bold text-slate-900">{selectedSlot.slotLabel}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Available Connectors:</span>
                  <span className="font-bold text-emerald-600">
                    {selectedSlot.availableConnectors?.map((c) => c.label).join(', ')}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleProceedToCheckout}
              disabled={!selectedSlot}
              className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/20 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              Book Selected Slot
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationDetailsPage;

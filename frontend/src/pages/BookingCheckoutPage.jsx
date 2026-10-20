import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Zap,
  MapPin,
  Calendar,
  Clock,
  Car,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookingCheckoutPage = () => {
  const { stationId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const preselectedConnectorId = searchParams.get('connectorId') || '';
  const preselectedStartTime = searchParams.get('startTime') || '';
  const preselectedEndTime = searchParams.get('endTime') || '';

  const [station, setStation] = useState(null);
  const [connectors, setConnectors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [connectorId, setConnectorId] = useState(preselectedConnectorId);
  const [startTime, setStartTime] = useState(preselectedStartTime);
  const [durationHours, setDurationHours] = useState(1);
  const [vehicleModel, setVehicleModel] = useState(user?.preferredVehicle?.model || '');
  const [vehicleRegNumber, setVehicleRegNumber] = useState(user?.preferredVehicle?.regNumber || '');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState('');

  useEffect(() => {
    const fetchStationAndConnectors = async () => {
      try {
        const { data } = await api.get(`/stations/${stationId}`);
        if (data.success) {
          setStation(data.data);
          const activeConns = data.data.connectors?.filter((c) => c.status !== 'offline') || [];
          setConnectors(activeConns);

          if (!connectorId && activeConns.length > 0) {
            setConnectorId(activeConns[0]._id);
          }
        }
      } catch (err) {
        console.error('Error loading checkout station:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStationAndConnectors();
  }, [stationId]);

  // Compute calculated End Time
  const calculatedEndTime = React.useMemo(() => {
    if (!startTime) {
      // Default to next hour if none provided
      const d = new Date();
      d.setHours(d.getHours() + 1, 0, 0, 0);
      return new Date(d.getTime() + durationHours * 3600000).toISOString();
    }
    const start = new Date(startTime);
    return new Date(start.getTime() + durationHours * 3600000).toISOString();
  }, [startTime, durationHours]);

  const selectedConnector = connectors.find((c) => c._id === connectorId);

  // Estimated Cost calculation (Duration in hours * drawRate * pricePerKwh)
  const estimatedCost = React.useMemo(() => {
    if (!station || !selectedConnector) return 0;
    const assumedDrawKw = Math.min(selectedConnector.powerKw, 50);
    const estimatedKwh = Math.round(durationHours * assumedDrawKw * 10) / 10;
    return Math.round(estimatedKwh * station.pricePerKwh);
  }, [station, selectedConnector, durationHours]);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setConflictError('');

    if (!connectorId) {
      setConflictError('Please select a charging connector');
      return;
    }

    const start = startTime ? new Date(startTime) : new Date(Date.now() + 3600000);
    const end = new Date(calculatedEndTime);

    setSubmitting(true);
    try {
      const { data } = await api.post('/bookings', {
        stationId,
        connectorId,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        notes,
        vehicleInfo: {
          model: vehicleModel,
          regNumber: vehicleRegNumber,
        },
      });

      if (data.success) {
        navigate(`/bookings/${data.data._id}`, { replace: true });
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setConflictError(
          'Reservation Conflict: This specific connector slot was just booked by another driver or overlaps with an existing reservation. Please select a different connector or time slot.'
        );
      } else {
        setConflictError(err.response?.data?.message || 'Failed to complete reservation. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link
        to={`/stations/${stationId}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Station Details
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Checkout & Confirmation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-0.5">
            Reserve Your Charging Slot
          </h1>
        </div>
      </div>

      {conflictError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Slot Unavailable</p>
            <p className="mt-0.5">{conflictError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Station Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4">
            <img
              src={station?.imageUrl}
              alt={station?.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-base">{station?.name}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {station?.address}, {station?.city}
              </p>
              <p className="text-xs font-semibold text-brand-700 mt-1">
                Rate: ₹{station?.pricePerKwh} / kWh
              </p>
            </div>
          </div>

          {/* Connector Selection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Choose Connector
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {connectors.map((c) => (
                <div
                  key={c._id}
                  onClick={() => setConnectorId(c._id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    connectorId === c._id
                      ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{c.label}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {c.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Max Power: {c.powerKw} kW</p>
                </div>
              ))}
            </div>
          </div>

          {/* Time & Duration */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Timing & Duration
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={
                    startTime
                      ? new Date(new Date(startTime).getTime() - new Date().getTimezoneOffset() * 60000)
                          .toISOString()
                          .slice(0, 16)
                      : ''
                  }
                  onChange={(e) => setStartTime(new Date(e.target.value).toISOString())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-xs sm:text-sm font-semibold text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Duration</label>
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-xs sm:text-sm font-semibold text-slate-800 outline-none bg-white"
                >
                  <option value={0.5}>30 Minutes</option>
                  <option value={1}>1 Hour (Standard)</option>
                  <option value={1.5}>1.5 Hours</option>
                  <option value={2}>2 Hours (Full Charge)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Vehicle Details (Optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Vehicle Model</label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="e.g. Tata Nexon EV"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-xs sm:text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">License Plate</label>
                <input
                  type="text"
                  value={vehicleRegNumber}
                  onChange={(e) => setVehicleRegNumber(e.target.value)}
                  placeholder="e.g. GJ-01-EV-2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-xs sm:text-sm outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card sticky top-20 space-y-5">
            <h3 className="font-extrabold text-navy-900 text-lg">Booking Summary</h3>

            <div className="space-y-3 divide-y divide-slate-100 text-xs">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Selected Station:</span>
                <span className="font-bold text-slate-900 text-right">{station?.name}</span>
              </div>

              <div className="pt-3 flex justify-between">
                <span className="text-slate-500">Connector:</span>
                <span className="font-bold text-slate-900">
                  {selectedConnector?.label} ({selectedConnector?.type} • {selectedConnector?.powerKw} kW)
                </span>
              </div>

              <div className="pt-3 flex justify-between">
                <span className="text-slate-500">Scheduled Time:</span>
                <span className="font-bold text-slate-900 text-right">
                  {startTime ? new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Next Hour'} (
                  {durationHours} hr)
                </span>
              </div>

              <div className="pt-3 flex justify-between">
                <span className="text-slate-500">Rate:</span>
                <span className="font-bold text-slate-900">₹{station?.pricePerKwh} / kWh</span>
              </div>

              <div className="pt-3 flex justify-between items-baseline text-sm">
                <span className="font-bold text-slate-800">Estimated Total Cost:</span>
                <span className="font-extrabold text-brand-600 text-lg">₹{estimatedCost}</span>
              </div>
            </div>

            {/* Note on Estimation */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-brand-600 inline mr-1" />
              <strong>College Demo Notice:</strong> The price is an estimate based on average battery draw. Overlapping bookings for this connector are locked in MongoDB with atomic isolation.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/20 hover:shadow-lg disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Confirm & Reserve Slot
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookingCheckoutPage;

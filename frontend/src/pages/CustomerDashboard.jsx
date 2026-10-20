import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Zap,
  MapPin,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Compass,
  User,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Badge from '../components/common/Badge';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/dashboard/customer');
        if (data.success) {
          setDashboardData(data.data);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalBookings: 0,
    upcomingBookings: 0,
    completedSessions: 0,
    cancelledBookings: 0,
  };

  const upcoming = dashboardData?.upcomingBooking;
  const recentBookings = dashboardData?.recentBookings || [];
  const nearbyStations = dashboardData?.nearbyStations || [];

  return (
    <div className="space-y-8">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Customer Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-0.5">
            Welcome back, {user?.name?.split(' ')[0] || 'Driver'}! ⚡
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Find your next charging station, check slot availability, and reserve with zero overlap.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/stations"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-600/20 hover:shadow-lg transition flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            Find Stations
          </Link>
          <Link
            to="/bookings"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            My Bookings
          </Link>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Bookings
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy-900 mt-2">{stats.totalBookings}</p>
          <p className="text-[11px] text-slate-400 mt-1">All-time reservations</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Upcoming
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-brand-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-brand-600 mt-2">{stats.upcomingBookings}</p>
          <p className="text-[11px] text-slate-400 mt-1">Active future slots</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Completed
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-sky-600 mt-2">{stats.completedSessions}</p>
          <p className="text-[11px] text-slate-400 mt-1">Charged successfully</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Cancelled
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-rose-600 mt-2">{stats.cancelledBookings}</p>
          <p className="text-[11px] text-slate-400 mt-1">Released slots</p>
        </div>
      </div>

      {/* Upcoming Reservation Banner */}
      {upcoming ? (
        <div className="bg-gradient-to-r from-navy-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-full opacity-10 pointer-events-none flex items-center justify-center">
            <Zap className="w-96 h-96" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-semibold ring-1 ring-brand-400/30">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
                Confirmed Upcoming Slot
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">
                {upcoming.stationId?.name || 'Charging Station'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" />
                {upcoming.stationId?.address}, {upcoming.stationId?.city}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
                <div className="bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                  <span className="text-slate-400 block text-[10px] uppercase">Connector</span>
                  <span className="font-bold text-white">
                    {upcoming.connectorId?.label} ({upcoming.connectorId?.type})
                  </span>
                </div>
                <div className="bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                  <span className="text-slate-400 block text-[10px] uppercase">Scheduled Time</span>
                  <span className="font-bold text-white">
                    {new Date(upcoming.startTime).toLocaleDateString([], {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    •{' '}
                    {new Date(upcoming.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -{' '}
                    {new Date(upcoming.endTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                  <span className="text-slate-400 block text-[10px] uppercase">Code</span>
                  <span className="font-mono font-bold text-brand-300">
                    {upcoming.bookingCode}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={`/bookings/${upcoming._id}`}
                className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition text-center shadow-md flex items-center justify-center gap-2"
              >
                View Ticket / Voucher
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No upcoming bookings</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any active reservations scheduled. Find a charging station nearby to book your slot.
          </p>
          <Link
            to="/stations"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs shadow-sm hover:bg-brand-700 transition"
          >
            Find a Station Now
          </Link>
        </div>
      )}

      {/* Grid: Nearby Stations + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Nearby Stations */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Recommended Stations</h3>
            <Link to="/stations" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {nearbyStations.map((station) => (
              <div
                key={station._id}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card transition flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={station.imageUrl}
                    alt={station.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{station.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {station.address}, {station.city}
                    </p>
                    <p className="text-[11px] font-semibold text-brand-700 mt-1">
                      ₹{station.pricePerKwh} / kWh • {station.openingTime} - {station.closingTime}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/stations/${station._id}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 font-semibold text-xs shrink-0 transition"
                >
                  Book Slot
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Recent Activity</h3>
            <Link to="/bookings" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              History
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 divide-y divide-slate-100 shadow-soft">
            {recentBookings.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No recent booking activity yet
              </div>
            ) : (
              recentBookings.map((b) => (
                <div key={b._id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900">
                        {b.stationId?.name || 'Charging Station'}
                      </p>
                      <Badge status={b.status} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {new Date(b.startTime).toLocaleDateString()} • {b.connectorId?.label}
                    </p>
                  </div>
                  <Link
                    to={`/bookings/${b._id}`}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Details
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;

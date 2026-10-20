import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Zap,
  ArrowRight,
  AlertCircle,
  XCircle,
  FileText,
  Search,
} from 'lucide-react';
import api from '../services/api';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Skeleton from '../components/common/Skeleton';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'confirmed' | 'completed' | 'cancelled'
  const [searchCode, setSearchCode] = useState('');

  // Cancel Modal State
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab !== 'all') params.status = activeTab;

      const { data } = await api.get('/bookings/my', { params });
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const handleCancelConfirm = async () => {
    if (!cancellingBooking) return;
    setCancelLoading(true);
    try {
      const { data } = await api.patch(`/bookings/${cancellingBooking._id}/cancel`);
      if (data.success) {
        setCancelMessage('Booking cancelled. The charging slot has been released back to availability.');
        setBookings((prev) =>
          prev.map((b) => (b._id === cancellingBooking._id ? { ...b, status: 'cancelled' } : b))
        );
        setTimeout(() => {
          setCancellingBooking(null);
          setCancelMessage('');
        }, 1500);
      }
    } catch (err) {
      setCancelMessage(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (!searchCode) return true;
    return (
      b.bookingCode.toLowerCase().includes(searchCode.toLowerCase()) ||
      b.stationId?.name.toLowerCase().includes(searchCode.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Booking History
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-0.5">
            My Reservations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View, inspect vouchers, and manage your electric vehicle charging sessions
          </p>
        </div>

        <Link
          to="/stations"
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-600/20 transition flex items-center gap-2 w-fit"
        >
          <Zap className="w-4 h-4" />
          Book New Slot
        </Link>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Bookings' },
            { id: 'confirmed', label: 'Upcoming' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Search code or station..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton.BookingRow key={i} />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No reservations found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any bookings matching the current filter.
          </p>
          <Link
            to="/stations"
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white font-semibold text-xs rounded-xl shadow-sm hover:bg-brand-700 transition"
          >
            Find a Station
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-brand-100">
                  <Zap className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {b.bookingCode}
                    </span>
                    <Badge status={b.status} />
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{b.stationId?.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {b.stationId?.address}, {b.stationId?.city}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                    <span className="font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(b.startTime).toLocaleDateString()} •{' '}
                      {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-800">
                      Connector: {b.connectorId?.label} ({b.connectorId?.type})
                    </span>
                    <span>•</span>
                    <span className="font-bold text-brand-700">₹{b.estimatedCost} (Est.)</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <Link
                  to={`/bookings/${b._id}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Voucher
                </Link>

                {b.status === 'confirmed' && (
                  <button
                    onClick={() => setCancellingBooking(b)}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!cancellingBooking}
        onClose={() => setCancellingBooking(null)}
        title="Cancel Charging Reservation?"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to cancel reservation{' '}
            <strong className="text-slate-900 font-mono">{cancellingBooking?.bookingCode}</strong>?
            The reserved connector will immediately become available for other EV drivers.
          </p>

          {cancelMessage && (
            <div className="p-3 rounded-xl bg-slate-100 text-xs text-slate-800 font-medium">
              {cancelMessage}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              onClick={() => setCancellingBooking(null)}
              disabled={cancelLoading}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Keep Booking
            </button>
            <button
              onClick={handleCancelConfirm}
              disabled={cancelLoading}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              {cancelLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Cancelling…
                </>
              ) : (
                'Confirm Cancellation'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyBookingsPage;

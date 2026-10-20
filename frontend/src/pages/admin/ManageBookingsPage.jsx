import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Search,
  Filter,
  XCircle,
  FileText,
  Clock,
  MapPin,
  Zap,
} from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const ManageBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;

      const { data } = await api.get('/admin/bookings', { params });
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error('Error fetching admin bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleCancel = async () => {
    if (!cancellingBooking) return;
    setCancelLoading(true);
    try {
      await api.patch(`/bookings/${cancellingBooking._id}/cancel`);
      setCancellingBooking(null);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel reservation');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Platform Reservations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-0.5">
            Manage Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Oversee active reservations, verify charging schedules, and release slots
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchBookings()}
            placeholder="Search booking code (e.g. CS-2026)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-none bg-white font-medium text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed (Upcoming)</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={fetchBookings}
            className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Reference</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Station & Connector</th>
                <th className="px-6 py-3.5">Scheduled Window</th>
                <th className="px-6 py-3.5">Est. Price</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Loading bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No bookings found matching criteria.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      {b.bookingCode}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{b.userId?.name || 'Customer'}</p>
                      <p className="text-[11px] text-slate-400">{b.userId?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{b.stationId?.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {b.connectorId?.label} ({b.connectorId?.type})
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">
                        {new Date(b.startTime).toLocaleDateString()}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-700">₹{b.estimatedCost}</td>
                    <td className="px-6 py-4">
                      <Badge status={b.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/bookings/${b._id}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition"
                        >
                          View
                        </Link>
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => setCancellingBooking(b)}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Cancel Confirmation Modal */}
      <Modal
        isOpen={!!cancellingBooking}
        onClose={() => setCancellingBooking(null)}
        title="Admin Override: Cancel Reservation"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            As administrator, do you wish to cancel reservation{' '}
            <strong className="font-mono text-slate-900">{cancellingBooking?.bookingCode}</strong>?
            This will immediately release the slot and notify the customer.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setCancellingBooking(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600"
            >
              Back
            </button>
            <button
              onClick={handleCancel}
              disabled={cancelLoading}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm transition"
            >
              {cancelLoading ? 'Cancelling...' : 'Confirm Admin Cancellation'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageBookingsPage;

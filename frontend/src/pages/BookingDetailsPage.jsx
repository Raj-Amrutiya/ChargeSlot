import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  MapPin,
  Calendar,
  Clock,
  Printer,
  ChevronLeft,
  XCircle,
  ShieldCheck,
  Car,
  User,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await api.get(`/bookings/${id}`);
        if (data.success) {
          setBooking(data.data);
        }
      } catch (err) {
        console.error('Error fetching booking details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const { data } = await api.patch(`/bookings/${id}/cancel`);
      if (data.success) {
        setBooking(data.data);
        setIsCancelModalOpen(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Booking Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          The requested booking ID does not exist or you do not have permission to view it.
        </p>
        <Link
          to="/bookings"
          className="mt-4 inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold"
        >
          Back to My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between no-print">
        <Link
          to="/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Bookings List
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Print Voucher
          </button>

          {booking.status === 'confirmed' && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              Cancel Booking
            </button>
          )}
        </div>
      </div>

      {/* Ticket / Voucher Container */}
      <div
        id="printable-voucher"
        className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden"
      >
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-navy-900 to-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                Charge<span className="text-brand-400">Slot</span> Pass
              </span>
            </div>
            <p className="text-xs text-slate-300">Official EV Charging Reservation Ticket</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Booking Code</span>
            <span className="font-mono text-xl font-black text-brand-400 tracking-wider">
              {booking.bookingCode}
            </span>
            <div className="mt-1">
              <Badge status={booking.status} />
            </div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Station Details */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Charging Station Location
            </span>
            <h3 className="text-xl font-bold text-slate-900">{booking.stationId?.name}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              {booking.stationId?.address}, {booking.stationId?.city} - {booking.stationId?.postalCode}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Date</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                {new Date(booking.startTime).toLocaleDateString([], {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Time Window</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Connector</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                {booking.connectorId?.label} ({booking.connectorId?.type})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Cost</span>
              <span className="font-black text-brand-600 text-sm mt-0.5 block">
                ₹{booking.estimatedCost}
              </span>
            </div>
          </div>

          {/* Customer & Vehicle Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-800 mb-2">
                <User className="w-4 h-4 text-slate-500" />
                Customer Information
              </div>
              <p className="text-slate-700 font-semibold">{booking.userId?.name}</p>
              <p className="text-slate-500">{booking.userId?.email}</p>
              {booking.userId?.phone && <p className="text-slate-500">{booking.userId.phone}</p>}
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-800 mb-2">
                <Car className="w-4 h-4 text-slate-500" />
                Vehicle Information
              </div>
              <p className="text-slate-700 font-semibold">
                {booking.vehicleInfo?.model || 'Standard EV'}
              </p>
              <p className="text-slate-500">
                Plate: {booking.vehicleInfo?.regNumber || 'Not Specified'}
              </p>
            </div>
          </div>

          {/* Simulated QR / Barcode strip */}
          <div className="pt-4 border-t border-dashed border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Decorative mini barcode pattern */}
              <div className="flex items-center gap-0.5 h-10 px-2 bg-slate-100 rounded-lg">
                {[4, 2, 6, 2, 3, 5, 2, 4, 2, 5, 3, 6, 2, 4, 3].map((w, i) => (
                  <span
                    key={i}
                    style={{ width: `${w}px` }}
                    className="h-7 bg-slate-800 inline-block"
                  />
                ))}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Scan at kiosk upon arrival • Valid ID: {booking._id}
              </div>
            </div>

            <span className="text-[11px] text-slate-400">
              Created: {new Date(booking.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Reservation?"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to cancel this booking? The slot will immediately be released for other drivers.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setIsCancelModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
            >
              Keep Slot
            </button>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm"
            >
              {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingDetailsPage;

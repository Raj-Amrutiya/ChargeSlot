import React from 'react';

/**
 * Skeleton — shimmer placeholder blocks for loading states.
 *
 * Usage:
 *   <Skeleton className="h-4 w-32 rounded-lg" />
 *   <Skeleton.Card />        – Generic card shimmer
 *   <Skeleton.StationCard /> – Station list-row shimmer
 *   <Skeleton.BookingRow />  – Booking list-row shimmer
 *   <Skeleton.StatCard />    – Dashboard stat card shimmer
 *   <Skeleton.Voucher />     – BookingDetailsPage voucher shimmer
 *   <Skeleton.CheckoutForm />– BookingCheckoutPage form shimmer
 *   <Skeleton.StationHero /> – StationDetailsPage hero shimmer
 *   <Skeleton.SlotGrid />    – Time-slot picker shimmer
 */

const pulse = 'animate-pulse bg-slate-200 rounded-lg';

// ─── Base block ──────────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`${pulse} ${className}`} />
);

// ─── Generic card ─────────────────────────────────────────────────────────────
Skeleton.Card = ({ lines = 3 }) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 space-y-3 animate-pulse">
    <div className="h-40 bg-slate-200 rounded-xl w-full" />
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className={`h-3 bg-slate-200 rounded-lg ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
    ))}
  </div>
);

// ─── Station list-row card (FindStationsPage) ─────────────────────────────────
Skeleton.StationCard = () => (
  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-soft flex flex-col sm:flex-row gap-4 animate-pulse">
    <div className="w-full sm:w-36 h-36 rounded-xl bg-slate-200 shrink-0" />
    <div className="flex-1 space-y-3 py-1">
      <div className="flex justify-between">
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="h-4 bg-slate-200 rounded w-16" />
      </div>
      <div className="h-3 bg-slate-200 rounded w-3/4" />
      <div className="flex gap-2 mt-2">
        <div className="h-5 bg-slate-200 rounded-full w-28" />
        <div className="h-5 bg-slate-200 rounded-full w-16" />
      </div>
      <div className="flex gap-1 mt-1">
        <div className="h-4 bg-slate-200 rounded w-10" />
        <div className="h-4 bg-slate-200 rounded w-12" />
      </div>
      <div className="flex justify-between pt-2 border-t border-slate-100">
        <div className="h-3 bg-slate-200 rounded w-28" />
        <div className="h-7 bg-slate-200 rounded-xl w-20" />
      </div>
    </div>
  </div>
);

// ─── Dashboard stat card ───────────────────────────────────────────────────────
Skeleton.StatCard = () => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft animate-pulse space-y-3">
    <div className="flex justify-between">
      <div className="h-3 bg-slate-200 rounded w-24" />
      <div className="w-8 h-8 bg-slate-200 rounded-xl" />
    </div>
    <div className="h-8 bg-slate-200 rounded w-16" />
    <div className="h-2.5 bg-slate-200 rounded w-28" />
  </div>
);

// ─── Booking list-row ─────────────────────────────────────────────────────────
Skeleton.BookingRow = () => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse">
    <div className="flex items-start gap-4 flex-1">
      <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
      <div className="space-y-2.5 flex-1">
        <div className="flex gap-2">
          <div className="h-5 bg-slate-200 rounded-md w-28" />
          <div className="h-5 bg-slate-200 rounded-full w-20" />
        </div>
        <div className="h-4 bg-slate-200 rounded w-3/5" />
        <div className="h-3 bg-slate-200 rounded w-2/5" />
        <div className="flex gap-3 pt-1">
          <div className="h-3 bg-slate-200 rounded w-40" />
          <div className="h-3 bg-slate-200 rounded w-24" />
        </div>
      </div>
    </div>
    <div className="flex gap-2 self-end md:self-center">
      <div className="h-8 bg-slate-200 rounded-xl w-24" />
      <div className="h-8 bg-slate-200 rounded-xl w-20" />
    </div>
  </div>
);

// ─── Station details hero ─────────────────────────────────────────────────────
Skeleton.StationHero = () => (
  <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-soft bg-white animate-pulse">
    <div className="h-64 sm:h-80 w-full bg-slate-200" />
    <div className="p-6 space-y-3">
      <div className="flex gap-2">
        <div className="h-5 bg-slate-200 rounded-full w-20" />
        <div className="h-5 bg-slate-200 rounded-full w-24" />
      </div>
      <div className="h-7 bg-slate-200 rounded w-3/5" />
      <div className="h-3 bg-slate-200 rounded w-2/5" />
    </div>
  </div>
);

// ─── Station details sidebar card ─────────────────────────────────────────────
Skeleton.StationDetailCard = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft animate-pulse space-y-4">
    <div className="h-5 bg-slate-200 rounded w-1/3" />
    <div className="space-y-2">
      <div className="h-3 bg-slate-200 rounded w-full" />
      <div className="h-3 bg-slate-200 rounded w-5/6" />
      <div className="h-3 bg-slate-200 rounded w-4/5" />
    </div>
    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
      <div className="space-y-1.5">
        <div className="h-2.5 bg-slate-200 rounded w-16" />
        <div className="h-4 bg-slate-200 rounded w-28" />
      </div>
      <div className="space-y-1.5">
        <div className="h-2.5 bg-slate-200 rounded w-16" />
        <div className="h-4 bg-slate-200 rounded w-24" />
      </div>
    </div>
    <div className="pt-2 border-t border-slate-100 space-y-2">
      <div className="h-2.5 bg-slate-200 rounded w-24" />
      <div className="flex gap-2 flex-wrap">
        <div className="h-6 bg-slate-200 rounded-xl w-20" />
        <div className="h-6 bg-slate-200 rounded-xl w-16" />
        <div className="h-6 bg-slate-200 rounded-xl w-24" />
      </div>
    </div>
  </div>
);

// ─── Connector card shimmer ───────────────────────────────────────────────────
Skeleton.ConnectorCard = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft animate-pulse space-y-4">
    <div className="h-5 bg-slate-200 rounded w-1/3" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[1, 2].map((i) => (
        <div key={i} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200" />
            <div className="space-y-1.5">
              <div className="h-3.5 bg-slate-200 rounded w-20" />
              <div className="h-3 bg-slate-200 rounded w-28" />
            </div>
          </div>
          <div className="h-5 bg-slate-200 rounded-full w-16" />
        </div>
      ))}
    </div>
  </div>
);

// ─── Slot picker shimmer ──────────────────────────────────────────────────────
Skeleton.SlotGrid = ({ count = 12 }) => (
  <div className="grid grid-cols-2 gap-2">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="h-14 rounded-xl bg-slate-200 animate-pulse"
        style={{ animationDelay: `${i * 50}ms` }}
      />
    ))}
  </div>
);

// ─── Booking voucher (BookingDetailsPage) ─────────────────────────────────────
Skeleton.Voucher = () => (
  <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden animate-pulse">
    {/* Header bar */}
    <div className="bg-slate-200 h-28 w-full" />
    <div className="p-6 sm:p-8 space-y-6">
      {/* Station name */}
      <div className="space-y-2">
        <div className="h-2.5 bg-slate-200 rounded w-20" />
        <div className="h-6 bg-slate-200 rounded w-2/3" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
      </div>
      {/* 4-column grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-100">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-2.5 bg-slate-200 rounded w-12" />
            <div className="h-4 bg-slate-200 rounded w-20" />
          </div>
        ))}
      </div>
      {/* Customer / Vehicle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-2/5" />
            <div className="h-3 bg-slate-200 rounded w-3/5" />
            <div className="h-3 bg-slate-200 rounded w-2/5" />
          </div>
        ))}
      </div>
      {/* Barcode strip */}
      <div className="pt-4 border-t border-dashed border-slate-200 flex items-center gap-3">
        <div className="h-10 w-28 bg-slate-200 rounded-lg" />
        <div className="h-3 bg-slate-200 rounded w-48" />
      </div>
    </div>
  </div>
);

// ─── Checkout form shimmer ────────────────────────────────────────────────────
Skeleton.CheckoutForm = () => (
  <div className="max-w-5xl mx-auto animate-pulse space-y-6">
    {/* Station card */}
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4">
      <div className="w-16 h-16 rounded-xl bg-slate-200 shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-slate-200 rounded w-2/5" />
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-3 bg-slate-200 rounded w-1/4" />
      </div>
    </div>
    {/* Connector section */}
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-3">
      <div className="h-3 bg-slate-200 rounded w-32" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 bg-slate-100 rounded-xl" />
        ))}
      </div>
    </div>
    {/* Timing */}
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-3">
      <div className="h-3 bg-slate-200 rounded w-40" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-10 bg-slate-100 rounded-xl" />
        <div className="h-10 bg-slate-100 rounded-xl" />
      </div>
    </div>
  </div>
);

// ─── Dashboard upcoming banner ────────────────────────────────────────────────
Skeleton.UpcomingBanner = () => (
  <div className="bg-slate-200 rounded-3xl h-40 w-full animate-pulse" />
);

// ─── Dashboard station mini-row ───────────────────────────────────────────────
Skeleton.StationRow = () => (
  <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex items-center justify-between gap-4 animate-pulse">
    <div className="flex items-center gap-3.5 flex-1 min-w-0">
      <div className="w-14 h-14 rounded-xl bg-slate-200 shrink-0" />
      <div className="space-y-1.5 flex-1">
        <div className="h-4 bg-slate-200 rounded w-2/3" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="h-3 bg-slate-200 rounded w-1/3" />
      </div>
    </div>
    <div className="h-8 w-20 bg-slate-200 rounded-xl shrink-0" />
  </div>
);

export default Skeleton;

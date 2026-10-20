import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Compass, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 shadow-soft">
        <Zap className="w-8 h-8 fill-current" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
        404 — Page Out of Range
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-1">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-2">
        The route you navigated to doesn't exist on this ChargeSlot network terminal. It might have been moved or archived.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition flex items-center gap-1.5"
        >
          <Home className="w-4 h-4" />
          Home
        </Link>
        <Link
          to="/stations"
          className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs shadow-md shadow-brand-600/20 hover:bg-brand-700 transition flex items-center gap-1.5"
        >
          <Compass className="w-4 h-4" />
          Find Stations
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

import React from 'react';

const Badge = ({ status, className = '' }) => {
  const getStyle = (s) => {
    switch (s?.toLowerCase()) {
      case 'available':
      case 'active':
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/10';
      case 'maintenance':
      case 'pending':
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-600/10';
      case 'offline':
      case 'cancelled':
      case 'inactive':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-600/10';
      case 'completed':
        return 'bg-sky-50 text-sky-700 border-sky-200 ring-1 ring-sky-600/10';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDotColor = (s) => {
    switch (s?.toLowerCase()) {
      case 'available':
      case 'active':
      case 'confirmed':
        return 'bg-emerald-500';
      case 'maintenance':
      case 'pending':
      case 'warning':
        return 'bg-amber-500';
      case 'offline':
      case 'cancelled':
      case 'inactive':
        return 'bg-rose-500';
      case 'completed':
        return 'bg-sky-500';
      default:
        return 'bg-slate-400';
    }
  };

  const formatText = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyle(
        status
      )} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor(status)}`} />
      {formatText(status)}
    </span>
  );
};

export default Badge;

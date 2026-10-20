import React from 'react';
import { Zap, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-lg text-slate-900">
                Charge<span className="text-brand-600">Slot</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Next-generation EV Charging Station Reservation System. Built with React, Express, MongoDB, Docker, and Kubernetes for college demonstration.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                System Operational
              </span>
              <span>•</span>
              <span>Ahmedabad & Gandhinagar Grid</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/stations" className="hover:text-brand-600 transition">
                  Find Stations
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-600 transition">
                  About ChargeSlot
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-brand-600 transition">
                  Help & FAQ
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-600 transition">
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-brand-600 transition">
                  Station Operator Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-600 transition">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['React.js', 'Express.js', 'MongoDB', 'Docker', 'Kubernetes', 'Tailwind CSS'].map(
                (tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              Raj's College Mini Project © 2026
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

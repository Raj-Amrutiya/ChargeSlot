import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Calendar,
  User,
  Shield,
  Layers,
  Zap,
  Users,
  BarChart3,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();

  const customerNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Find Stations', path: '/stations', icon: Compass },
    { name: 'My Bookings', path: '/bookings', icon: Calendar },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const adminNav = [
    { name: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Charging Stations', path: '/admin/stations', icon: Zap },
    { name: 'Connectors', path: '/admin/connectors', icon: Layers },
    { name: 'Manage Bookings', path: '/admin/bookings', icon: Calendar },
    { name: 'User Management', path: '/admin/users', icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col min-h-[calc(100vh-4rem)]">
      {/* User Mini Card */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate">{user?.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] text-slate-500 capitalize">{user?.role} Portal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Links */}
      <div className="p-4 flex-1 space-y-6 overflow-y-auto">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Main Menu
          </p>
          <div className="space-y-1">
            {customerNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Admin Navigation Section */}
        {isAdmin && (
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                Admin Controls
              </p>
              <Shield className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="space-y-1">
              {adminNav.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-purple-50 text-purple-700 shadow-sm'
                        : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/50'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

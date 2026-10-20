import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';

const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Pages where sidebar is shown
  const isDashboardRoute =
    isAuthenticated &&
    (location.pathname.startsWith('/dashboard') ||
      location.pathname.startsWith('/bookings') ||
      location.pathname.startsWith('/profile') ||
      location.pathname.startsWith('/admin'));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {isDashboardRoute && <Sidebar />}

        <main className={`flex-1 transition-all ${isDashboardRoute ? 'p-4 sm:p-6 lg:p-8' : 'w-full'}`}>
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AppLayout;

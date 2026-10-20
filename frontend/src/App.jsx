import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public & Customer Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FindStationsPage from './pages/FindStationsPage';
import StationDetailsPage from './pages/StationDetailsPage';
import BookingCheckoutPage from './pages/BookingCheckoutPage';
import CustomerDashboard from './pages/CustomerDashboard';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStationsPage from './pages/admin/ManageStationsPage';
import ManageConnectorsPage from './pages/admin/ManageConnectorsPage';
import ManageBookingsPage from './pages/admin/ManageBookingsPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';

import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/stations" element={<FindStationsPage />} />
        <Route path="/stations/:id" element={<StationDetailsPage />} />

        {/* Customer Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:stationId"
          element={
            <ProtectedRoute>
              <BookingCheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:id"
          element={
            <ProtectedRoute>
              <BookingDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stations"
          element={
            <ProtectedRoute adminOnly>
              <ManageStationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/connectors"
          element={
            <ProtectedRoute adminOnly>
              <ManageConnectorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute adminOnly>
              <ManageBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <ManageUsersPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Catch All */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;

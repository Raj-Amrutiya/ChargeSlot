import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Car, Shield, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [vehicleModel, setVehicleModel] = useState(user?.preferredVehicle?.model || '');
  const [vehicleRegNumber, setVehicleRegNumber] = useState(user?.preferredVehicle?.regNumber || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSaving(true);

    try {
      const payload = {
        name,
        phone,
        preferredVehicle: {
          model: vehicleModel,
          regNumber: vehicleRegNumber,
        },
      };

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const { data } = await api.patch('/users/me', payload);
      if (data.success) {
        updateUser(data.data);
        setSuccessMsg('Profile updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
          Account Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-0.5">
          User Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your personal information, preferred vehicle, and security credentials
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-brand-500/20">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{user?.name}</h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Role: {user?.role}
              </span>
              <span className="text-[11px] text-slate-400">
                Active Member
              </span>
            </div>
          </div>
        </div>

        {/* Basic Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Personal Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-xs sm:text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address (Read-only)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-xs sm:text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-xs sm:text-sm outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preferred Vehicle */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Vehicle Preferences</h3>
          <p className="text-xs text-slate-500">
            These will be auto-filled during slot reservations for faster checkout.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Vehicle Model
              </label>
              <div className="relative">
                <Car className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="e.g. Tata Nexon EV Max"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-xs sm:text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                License Plate / Reg Number
              </label>
              <input
                type="text"
                value={vehicleRegNumber}
                onChange={(e) => setVehicleRegNumber(e.target.value)}
                placeholder="e.g. GJ-01-EV-2026"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-xs sm:text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Security & Password</h3>
          <p className="text-xs text-slate-500">
            Leave blank if you do not want to change your password.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-xs sm:text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-xs sm:text-sm outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/20 transition disabled:opacity-50"
          >
            {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;

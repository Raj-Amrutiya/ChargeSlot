import React, { useState, useEffect } from 'react';
import {
  Zap,
  Plus,
  Search,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Layers,
  AlertCircle,
  Check,
} from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const ManageStationsPage = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: 'Ahmedabad',
    postalCode: '380015',
    latitude: 23.0373,
    longitude: 72.5293,
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80',
    openingTime: '06:00',
    closingTime: '23:00',
    pricePerKwh: 18,
    amenities: 'Parking, Restroom, Wi-Fi',
    status: 'active',
  });

  const fetchStations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const { data } = await api.get('/stations', { params });
      if (data.success) {
        setStations(data.data);
      }
    } catch (err) {
      console.error('Error fetching stations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, [statusFilter]);

  const handleOpenAdd = () => {
    setEditingStation(null);
    setFormData({
      name: '',
      description: '',
      address: '',
      city: 'Ahmedabad',
      postalCode: '380015',
      latitude: 23.0373,
      longitude: 72.5293,
      imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80',
      openingTime: '06:00',
      closingTime: '23:00',
      pricePerKwh: 18,
      amenities: 'Parking, Restroom, Wi-Fi',
      status: 'active',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (station) => {
    setEditingStation(station);
    setFormData({
      name: station.name,
      description: station.description || '',
      address: station.address,
      city: station.city,
      postalCode: station.postalCode,
      latitude: station.location?.coordinates ? station.location.coordinates[1] : 23.03,
      longitude: station.location?.coordinates ? station.location.coordinates[0] : 72.55,
      imageUrl: station.imageUrl || '',
      openingTime: station.openingTime || '06:00',
      closingTime: station.closingTime || '23:00',
      pricePerKwh: station.pricePerKwh || 18,
      amenities: Array.isArray(station.amenities) ? station.amenities.join(', ') : '',
      status: station.status,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setModalLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        imageUrl: formData.imageUrl,
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        pricePerKwh: Number(formData.pricePerKwh),
        amenities: formData.amenities
          ? formData.amenities.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        status: formData.status,
      };

      if (editingStation) {
        await api.patch(`/stations/${editingStation._id}`, payload);
      } else {
        await api.post('/stations', payload);
      }

      setIsModalOpen(false);
      fetchStations();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving charging station');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (station) => {
    if (!window.confirm(`Are you sure you want to delete/archive station "${station.name}"?`)) {
      return;
    }

    try {
      await api.delete(`/stations/${station._id}`);
      fetchStations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete station');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Station Management (CRUD)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-0.5">
            Charging Stations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create, edit, inspect connectors, and archive network locations
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" />
          Add New Station
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchStations()}
            placeholder="Search stations by name, address or city..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none bg-white text-slate-700 font-medium"
          >
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Archived / Inactive</option>
          </select>

          <button
            onClick={fetchStations}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Stations Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Station</th>
                <th className="px-6 py-3.5">City & Address</th>
                <th className="px-6 py-3.5">Rate</th>
                <th className="px-6 py-3.5">Operating Hours</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Loading station records...
                  </td>
                </tr>
              ) : stations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No charging stations found.
                  </td>
                </tr>
              ) : (
                stations.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.imageUrl}
                          alt={s.name}
                          className="w-10 h-10 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80';
                          }}
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {s.availableConnectors || 0} / {s.totalConnectors || 0} Connectors Available
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{s.city}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-xs">{s.address}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-700">₹{s.pricePerKwh} / kWh</td>
                    <td className="px-6 py-4 text-slate-600">
                      {s.openingTime} - {s.closingTime}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={s.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition"
                          title="Edit Station"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Archive / Delete Station"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Station Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStation ? 'Edit Charging Station' : 'Add New Charging Station'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
              {formError}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Station Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Vastrapur Supercharge Plaza"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address or landmark"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Ahmedabad"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Postal Code *</label>
              <input
                type="text"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                required
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                required
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Price / kWh (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={formData.pricePerKwh}
                onChange={(e) => setFormData({ ...formData, pricePerKwh: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Opening Time</label>
              <input
                type="text"
                value={formData.openingTime}
                onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                placeholder="06:00"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Closing Time</label>
              <input
                type="text"
                value={formData.closingTime}
                onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                placeholder="23:00"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Image URL</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Amenities (comma separated)
            </label>
            <input
              type="text"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              placeholder="Café, Restroom, Wi-Fi, Parking"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Operational Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none bg-white font-medium"
            >
              <option value="active">Active (Online in network)</option>
              <option value="inactive">Inactive / Archived</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={modalLoading}
              className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-sm transition disabled:opacity-50"
            >
              {modalLoading ? 'Saving...' : editingStation ? 'Update Station' : 'Create Station'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageStationsPage;

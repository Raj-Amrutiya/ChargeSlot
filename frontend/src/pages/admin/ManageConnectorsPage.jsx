import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Zap,
  Edit2,
  Trash2,
  Filter,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const ManageConnectorsPage = () => {
  const [connectors, setConnectors] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStationFilter, setSelectedStationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConnector, setEditingConnector] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    stationId: '',
    label: '',
    type: 'CCS2',
    powerKw: 60,
    status: 'available',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [connRes, stationsRes] = await Promise.all([
        api.get('/connectors', {
          params: {
            stationId: selectedStationFilter || undefined,
            status: statusFilter || undefined,
          },
        }),
        api.get('/stations'),
      ]);

      if (connRes.data.success) {
        setConnectors(connRes.data.data);
      }
      if (stationsRes.data.success) {
        setStations(stationsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching connectors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedStationFilter, statusFilter]);

  const handleOpenAdd = () => {
    setEditingConnector(null);
    setFormData({
      stationId: stations[0]?._id || '',
      label: '',
      type: 'CCS2',
      powerKw: 60,
      status: 'available',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (conn) => {
    setEditingConnector(conn);
    setFormData({
      stationId: conn.stationId?._id || conn.stationId,
      label: conn.label,
      type: conn.type,
      powerKw: conn.powerKw,
      status: conn.status,
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
        stationId: formData.stationId,
        label: formData.label,
        type: formData.type,
        powerKw: Number(formData.powerKw),
        status: formData.status,
      };

      if (editingConnector) {
        await api.patch(`/connectors/${editingConnector._id}`, payload);
      } else {
        await api.post('/connectors', payload);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save connector');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (conn) => {
    if (!window.confirm(`Are you sure you want to deactivate/delete connector "${conn.label}"?`)) {
      return;
    }

    try {
      await api.delete(`/connectors/${conn._id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete connector');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Hardware Configuration (CRUD)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-0.5">
            Manage Connectors
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure individual charging ports, power ratings, and maintenance states
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" />
          Add Connector
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <select
            value={selectedStationFilter}
            onChange={(e) => setSelectedStationFilter(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-none bg-white font-medium text-slate-700"
          >
            <option value="">All Stations ({stations.length})</option>
            {stations.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.city})
              </option>
            ))}
          </select>
        </div>

        <div className="w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-none bg-white font-medium text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Connectors Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Connector Label</th>
                <th className="px-6 py-3.5">Assigned Station</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Power Rating</th>
                <th className="px-6 py-3.5">Operational Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Loading connector list...
                  </td>
                </tr>
              ) : connectors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No connectors found matching filter.
                  </td>
                </tr>
              ) : (
                connectors.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 text-sm">
                      {c.label}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{c.stationId?.name || 'N/A'}</p>
                      <p className="text-[11px] text-slate-400">{c.stationId?.city}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {c.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{c.powerKw} kW</td>
                    <td className="px-6 py-4">
                      <Badge status={c.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition"
                          title="Edit Connector"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Deactivate / Delete Connector"
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

      {/* Add / Edit Connector Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingConnector ? 'Edit Charging Connector' : 'Add New Connector'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
              {formError}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Station *</label>
            <select
              required
              value={formData.stationId}
              onChange={(e) => setFormData({ ...formData, stationId: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none bg-white font-medium"
            >
              <option value="">Select a station</option>
              {stations.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Connector Identifier *</label>
            <input
              type="text"
              required
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="e.g. CCS2-03 or TYPE2-A"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Connector Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none bg-white"
              >
                <option value="CCS2">CCS2 (DC Fast)</option>
                <option value="Type 2">Type 2 (AC Fast)</option>
                <option value="CHAdeMO">CHAdeMO (DC)</option>
                <option value="GB/T">GB/T</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Power Rating (kW) *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.powerKw}
                onChange={(e) => setFormData({ ...formData, powerKw: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Operational Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none bg-white font-medium"
            >
              <option value="available">Available (Operational for booking)</option>
              <option value="maintenance">Maintenance (Temporarily blocked)</option>
              <option value="offline">Offline (Hardware disconnected)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
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
              {modalLoading ? 'Saving...' : editingConnector ? 'Update Connector' : 'Create Connector'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageConnectorsPage;

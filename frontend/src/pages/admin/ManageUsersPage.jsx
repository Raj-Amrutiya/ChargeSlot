import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, UserCheck, UserX, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

const ManageUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const { data } = await api.get('/admin/users', { params });
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleToggleStatus = async (user) => {
    if (user._id === currentUser._id) {
      alert('You cannot deactivate your own administrative account.');
      return;
    }

    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    if (!window.confirm(`Are you sure you want to set status of "${user.name}" to ${newStatus}?`)) {
      return;
    }

    try {
      await api.patch(`/admin/users/${user._id}`, { status: newStatus });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleToggleRole = async (user) => {
    if (user._id === currentUser._id) {
      alert('You cannot change role on your own administrative account.');
      return;
    }

    const newRole = user.role === 'customer' ? 'admin' : 'customer';
    if (!window.confirm(`Promote/demote "${user.name}" to ${newRole}?`)) {
      return;
    }

    try {
      await api.patch(`/admin/users/${user._id}`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            User Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-0.5">
            Manage Users
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Audit registered customer and administrator accounts, roles, and status
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-none bg-white font-medium text-slate-700"
          >
            <option value="">All Roles</option>
            <option value="customer">Customers</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-none bg-white font-medium text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={fetchUsers}
            className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800 transition"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Contact</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Preferred Vehicle</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Joined</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Loading user records...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No users found matching query.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{u.phone || '—'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">
                        {u.preferredVehicle?.model || '—'}
                      </p>
                      {u.preferredVehicle?.regNumber && (
                        <p className="text-[10px] text-slate-400 font-mono">
                          {u.preferredVehicle.regNumber}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={u.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleRole(u)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px] transition"
                          title="Switch between Admin and Customer"
                        >
                          {u.role === 'customer' ? 'Make Admin' : 'Make Customer'}
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`px-2.5 py-1 rounded-lg font-semibold text-[10px] transition ${
                            u.status === 'active'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
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
    </div>
  );
};

export default ManageUsersPage;

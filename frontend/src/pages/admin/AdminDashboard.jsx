import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Layers,
  Calendar,
  Users,
  TrendingUp,
  Shield,
  ArrowRight,
  Plus,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import api from '../../services/api';
import Badge from '../../components/common/Badge';

const COLORS = ['#16A34A', '#38BDF8', '#F59E0B', '#EF4444'];

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, analyticsRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/analytics'),
        ]);

        if (dashRes.data.success) {
          setDashboardData(dashRes.data.data);
        }
        if (analyticsRes.data.success) {
          setAnalytics(analyticsRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const metrics = dashboardData?.metrics || {};
  const recentBookings = dashboardData?.recentBookings || [];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Admin Control Center
            </span>
            <Shield className="w-4 h-4 text-purple-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            Station Operator Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time telemetry, connector occupancy, reservation metrics, and platform health
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/stations"
            className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Station
          </Link>
          <Link
            to="/admin/connectors"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            Manage Connectors
          </Link>
        </div>
      </div>

      {/* Top 5 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Stations
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy-900 mt-2">{metrics.totalStations || 0}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            {metrics.activeStations || 0} active in grid
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Connectors
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy-900 mt-2">{metrics.totalConnectors || 0}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            {metrics.activeConnectors || 0} available now
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Bookings
            </span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy-900 mt-2">{metrics.totalBookings || 0}</p>
          <p className="text-[11px] text-brand-600 font-semibold mt-1">
            {metrics.confirmedBookings || 0} confirmed slots
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Est. Value
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy-900 mt-2">
            ₹{metrics.estimatedTotalValue || 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Estimated booking draw</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Customers
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy-900 mt-2">{metrics.totalUsers || 0}</p>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">Registered drivers</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Trend Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">7-Day Reservation Trend</h3>
              <p className="text-xs text-slate-500">Daily bookings across all stations</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-50 text-purple-700">
              Past 7 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.dailyTrends || []}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7E22CE" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7E22CE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#7E22CE"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorTrend)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Status Distribution</h3>
            <p className="text-xs text-slate-500">All recorded reservations</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.statusDistribution || []}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(analytics?.statusDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            {(analytics?.statusDistribution || []).map((item, index) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="capitalize text-slate-600 font-medium">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings Across the Platform */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Platform Reservations</h3>
            <p className="text-xs text-slate-500">Live booking activity across network</p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-semibold text-purple-700 hover:text-purple-800 flex items-center gap-1"
          >
            View all bookings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Code</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Station & Connector</th>
                <th className="px-6 py-3.5">Schedule</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentBookings.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">
                    {b.bookingCode}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{b.userId?.name || 'Customer'}</p>
                    <p className="text-[11px] text-slate-400">{b.userId?.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{b.stationId?.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {b.connectorId?.label} ({b.connectorId?.type})
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">
                      {new Date(b.startTime).toLocaleDateString()}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={b.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/bookings/${b._id}`}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

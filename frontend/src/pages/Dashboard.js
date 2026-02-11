import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sidebar } from '../components/Sidebar';
import { Package, Weight, TrendingUp, Activity, Plus, Clock, Users as UsersIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, batchesRes] = await Promise.all([
        axios.get(`${API}/dashboard/stats`),
        axios.get(`${API}/batches`)
      ]);
      setStats(statsRes.data);
      setBatches(batchesRes.data.slice(0, 5)); // Get latest 5 batches
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-900/50 text-emerald-400 border-emerald-800';
      case 'In Progress':
        return 'bg-amber-900/50 text-amber-400 border-amber-800';
      case 'Pending':
        return 'bg-blue-900/50 text-blue-400 border-blue-800';
      default:
        return 'bg-slate-900/50 text-slate-400 border-slate-800';
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Melting':
        return 'bg-red-900/50 text-red-400 border-red-800';
      case 'Casting':
        return 'bg-orange-900/50 text-orange-400 border-orange-800';
      case 'Finishing':
        return 'bg-blue-900/50 text-blue-400 border-blue-800';
      default:
        return 'bg-slate-900/50 text-slate-400 border-slate-800';
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64 min-h-screen flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen industrial-bg">
        <div className="max-w-7xl mx-auto p-6 md:p-8">
          {/* Header */}
          <div className="mb-8 fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 uppercase tracking-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>
              Welcome to the Dashboard
            </h1>
            <p className="text-slate-400">Monitor your steel production operations in real-time</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 fade-in">
            <div data-testid="stat-card-active-batches" className="stat-card bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Package className="text-blue-400" size={24} />
                </div>
                <span className="text-xs uppercase text-slate-500 tracking-wider font-bold">Active</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {stats?.active_batches || 0}
              </h3>
              <p className="text-slate-400 text-sm uppercase tracking-wide">Batches</p>
            </div>

            <div data-testid="stat-card-raw-material" className="stat-card bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Weight className="text-green-400" size={24} />
                </div>
                <span className="text-xs uppercase text-slate-500 tracking-wider font-bold">Total Material</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {stats?.total_raw_material?.toLocaleString() || 0}
              </h3>
              <p className="text-slate-400 text-sm uppercase tracking-wide">kg</p>
            </div>

            <div data-testid="stat-card-output" className="stat-card bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp className="text-purple-400" size={24} />
                </div>
                <span className="text-xs uppercase text-slate-500 tracking-wider font-bold">Output</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {stats?.total_output?.toLocaleString() || 0}
              </h3>
              <p className="text-slate-400 text-sm uppercase tracking-wide">kg</p>
            </div>

            <div data-testid="stat-card-efficiency" className="stat-card bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Activity className="text-orange-400" size={24} />
                </div>
                <span className="text-xs uppercase text-slate-500 tracking-wider font-bold">Efficiency</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {stats?.efficiency || 0}%
              </h3>
              <p className="text-slate-400 text-sm uppercase tracking-wide">Rate</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 fade-in">
            <Link
              to="/employees"
              data-testid="quick-action-employees"
              className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <UsersIcon className="text-blue-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase" style={{ fontFamily: 'Oswald, sans-serif' }}>Employees</h3>
                  <p className="text-slate-400 text-sm">Manage workforce</p>
                </div>
              </div>
            </Link>

            <Link
              to="/shift-allocation"
              data-testid="quick-action-shift"
              className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Clock className="text-purple-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase" style={{ fontFamily: 'Oswald, sans-serif' }}>Shift Allocation</h3>
                  <p className="text-slate-400 text-sm">Assign shifts</p>
                </div>
              </div>
            </Link>

            <Link
              to="/attendance"
              data-testid="quick-action-attendance"
              className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <UsersIcon className="text-green-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase" style={{ fontFamily: 'Oswald, sans-serif' }}>Attendance</h3>
                  <p className="text-slate-400 text-sm">Track attendance</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Batches */}
          <div className="fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white uppercase tracking-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>
                Recent Production Batches
              </h2>
              <Link
                to="/add-batch"
                data-testid="add-batch-button"
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200 uppercase tracking-wide text-sm"
              >
                <Plus size={18} />
                Add Batch
              </Link>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 uppercase text-xs font-bold tracking-wider">
                      <th className="py-3 px-4 text-left">Batch Name</th>
                      <th className="py-3 px-4 text-left">Raw Material (kg)</th>
                      <th className="py-3 px-4 text-left">Output (kg)</th>
                      <th className="py-3 px-4 text-left">Stage</th>
                      <th className="py-3 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 px-4 text-center text-slate-400">
                          No batches found. Create your first batch to get started.
                        </td>
                      </tr>
                    ) : (
                      batches.map((batch) => (
                        <tr
                          key={batch.id}
                          data-testid={`batch-row-${batch.id}`}
                          className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors duration-150"
                        >
                          <td className="py-3 px-4 text-sm text-slate-300 font-medium">{batch.batch_name}</td>
                          <td className="py-3 px-4 text-sm text-slate-300">{batch.raw_material_qty}</td>
                          <td className="py-3 px-4 text-sm text-slate-300">{batch.output_qty}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide border ${getStageColor(batch.production_stage)}`}>
                              {batch.production_stage}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide border ${getStatusColor(batch.status)}`}>
                              {batch.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

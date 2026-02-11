import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sidebar } from '../components/Sidebar';
import { ClipboardList, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ViewBatches() {
  const [batches, setBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get(`${API}/batches`);
      setBatches(response.data);
    } catch (error) {
      toast.error('Failed to fetch batches');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (batchId) => {
    if (!window.confirm('Are you sure you want to delete this batch?')) return;

    try {
      await axios.delete(`${API}/batches/${batchId}`);
      toast.success('Batch deleted successfully');
      fetchBatches();
    } catch (error) {
      toast.error('Failed to delete batch');
      console.error(error);
    }
  };

  const filteredBatches = batches.filter(batch =>
    batch.batch_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              View Production Batches
            </h1>
            <p className="text-slate-400">Manage and track all production batches</p>
          </div>

          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 fade-in">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                data-testid="search-batches-input"
                placeholder="Search batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-slate-500 transition-all duration-200"
              />
            </div>
            <Link
              to="/add-batch"
              data-testid="add-new-batch-button"
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 uppercase tracking-wide text-sm whitespace-nowrap"
            >
              <Plus size={18} />
              Add Batch
            </Link>
          </div>

          {/* Batches Table */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 uppercase text-xs font-bold tracking-wider">
                    <th className="py-3 px-4 text-left">Batch Name</th>
                    <th className="py-3 px-4 text-left">Raw Material (kg)</th>
                    <th className="py-3 px-4 text-left">Output (kg)</th>
                    <th className="py-3 px-4 text-left">Stage</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBatches.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 px-4 text-center text-slate-400">
                        {searchTerm ? 'No batches found matching your search.' : 'No batches found. Create your first batch to get started.'}
                      </td>
                    </tr>
                  ) : (
                    filteredBatches.map((batch) => (
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
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              data-testid={`delete-batch-${batch.id}`}
                              onClick={() => handleDelete(batch.id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-all duration-200"
                              title="Delete"
                            >
                              <Trash2 size={18} />
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

          {/* Stats Summary */}
          <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <p className="text-slate-400 text-sm">
              Showing <span className="font-bold text-white">{filteredBatches.length}</span> of <span className="font-bold text-white">{batches.length}</span> batches
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

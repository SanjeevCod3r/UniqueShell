import React, { useState } from 'react';
import axios from 'axios';
import { Sidebar } from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AddBatch() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    batch_name: '',
    raw_material_qty: '',
    production_stage: 'Melting',
    output_qty: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/batches`, {
        ...formData,
        raw_material_qty: parseFloat(formData.raw_material_qty),
        output_qty: parseFloat(formData.output_qty),
      });
      toast.success('Batch created successfully!');
      navigate('/view-batches');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen industrial-bg">
        <div className="max-w-4xl mx-auto p-6 md:p-8">
          {/* Header */}
          <div className="mb-8 fade-in">
            <button
              onClick={() => navigate(-1)}
              data-testid="back-button"
              className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 uppercase tracking-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>
              Add Production Batch
            </h1>
            <p className="text-slate-400">Create a new production batch for tracking</p>
          </div>

          {/* Form Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 md:p-8 fade-in">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-700">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Package className="text-orange-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white uppercase" style={{ fontFamily: 'Oswald, sans-serif' }}>Batch Information</h2>
                <p className="text-slate-400 text-sm">Enter the details below</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="batch_name" className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">
                  Batch Name
                </label>
                <input
                  id="batch_name"
                  data-testid="batch-name-input"
                  type="text"
                  name="batch_name"
                  value={formData.batch_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-slate-500 transition-all duration-200"
                  placeholder="e.g., Batch A"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="raw_material_qty" className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">
                    Raw Material Quantity (kg)
                  </label>
                  <input
                    id="raw_material_qty"
                    data-testid="raw-material-input"
                    type="number"
                    name="raw_material_qty"
                    value={formData.raw_material_qty}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-slate-500 transition-all duration-200"
                    placeholder="600"
                  />
                </div>

                <div>
                  <label htmlFor="output_qty" className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">
                    Output Quantity (kg)
                  </label>
                  <input
                    id="output_qty"
                    data-testid="output-qty-input"
                    type="number"
                    name="output_qty"
                    value={formData.output_qty}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-slate-500 transition-all duration-200"
                    placeholder="500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="production_stage" className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">
                  Production Stage
                </label>
                <select
                  id="production_stage"
                  data-testid="production-stage-select"
                  name="production_stage"
                  value={formData.production_stage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="Melting">Melting</option>
                  <option value="Casting">Casting</option>
                  <option value="Finishing">Finishing</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  data-testid="save-batch-button"
                  disabled={loading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Batch'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  data-testid="cancel-button"
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg border border-slate-600 transition-all duration-200 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

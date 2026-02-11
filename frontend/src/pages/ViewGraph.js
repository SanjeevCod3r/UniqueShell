import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sidebar } from '../components/Sidebar';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ViewGraph() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get(`${API}/batches`);
      setBatches(response.data);
    } catch (error) {
      toast.error('Failed to fetch batch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = batches.slice(0, 10).map(batch => ({
    name: batch.batch_name,
    'Raw Material (kg)': batch.raw_material_qty,
    'Output (kg)': batch.output_qty,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()} kg
            </p>
          ))}
        </div>
      );
    }
    return null;
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
              Production Analysis Graph
            </h1>
            <p className="text-slate-400">Visualize raw material vs output across batches</p>
          </div>

          {/* Graph Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 md:p-8 fade-in">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-700">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <BarChart3 className="text-blue-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white uppercase" style={{ fontFamily: 'Oswald, sans-serif' }}>Production Analysis</h2>
                <p className="text-slate-400 text-sm">Batch performance comparison</p>
              </div>
            </div>

            {batches.length === 0 ? (
              <div className="py-16 text-center">
                <BarChart3 className="mx-auto mb-4 text-slate-600" size={64} />
                <p className="text-slate-400 text-lg mb-2">No data available</p>
                <p className="text-slate-500 text-sm">Create production batches to see analytics</p>
              </div>
            ) : (
              <div data-testid="production-chart" style={{ width: '100%', height: 500 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      stroke="#475569"
                    />
                    <YAxis
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      stroke="#475569"
                      label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(71, 85, 105, 0.2)' }} />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="rect"
                      formatter={(value) => <span style={{ color: '#f8fafc' }}>{value}</span>}
                    />
                    <Bar dataKey="Raw Material (kg)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Output (kg)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Stats Summary */}
          {batches.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 fade-in">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">Total Batches</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {batches.length}
                </p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">Total Raw Material</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {batches.reduce((sum, b) => sum + b.raw_material_qty, 0).toLocaleString()} kg
                </p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">Total Output</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {batches.reduce((sum, b) => sum + b.output_qty, 0).toLocaleString()} kg
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

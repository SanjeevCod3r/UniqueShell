import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sidebar } from '../components/Sidebar';
import { Clock, Plus } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ShiftAllocation() {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    employee_id: '',
    employee_name: '',
    shift: 'Morning',
    date: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [employeesRes, shiftsRes] = await Promise.all([
        axios.get(`${API}/employees`),
        axios.get(`${API}/shifts`)
      ]);
      setEmployees(employeesRes.data);
      setShifts(shiftsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employee_id) {
      toast.error('Please select an employee');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API}/shifts`, formData);
      toast.success('Shift allocated successfully');
      setFormData({
        employee_id: '',
        employee_name: '',
        shift: 'Morning',
        date: new Date().toISOString().split('T')[0],
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to allocate shift');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmployeeChange = (e) => {
    const selectedId = e.target.value;
    const selectedEmployee = employees.find(emp => emp.id === selectedId);
    setFormData(prev => ({
      ...prev,
      employee_id: selectedId,
      employee_name: selectedEmployee?.name || ''
    }));
  };

  const getShiftColor = (shift) => {
    switch (shift) {
      case 'Morning':
        return 'bg-amber-900/50 text-amber-400 border-amber-800';
      case 'Evening':
        return 'bg-orange-900/50 text-orange-400 border-orange-800';
      case 'Night':
        return 'bg-indigo-900/50 text-indigo-400 border-indigo-800';
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
              Shift Allocation
            </h1>
            <p className="text-slate-400">Assign shifts to employees</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Assign Shift Form */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 fade-in">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-700">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Clock className="text-purple-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase" style={{ fontFamily: 'Oswald, sans-serif' }}>Assign Shift</h2>
                  <p className="text-slate-400 text-sm">Select employee and shift</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="employee" className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">
                    Employee
                  </label>
                  <select
                    id="employee"
                    data-testid="employee-select"
                    value={formData.employee_id}
                    onChange={handleEmployeeChange}
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="shift" className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">
                    Shift
                  </label>
                  <select
                    id="shift"
                    data-testid="shift-select"
                    value={formData.shift}
                    onChange={(e) => setFormData(prev => ({ ...prev, shift: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">
                    Date
                  </label>
                  <input
                    id="date"
                    data-testid="date-input"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <button
                  type="submit"
                  data-testid="assign-shift-button"
                  disabled={submitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-200 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Assigning...' : 'Assign Shift'}
                </button>
              </form>
            </div>

            {/* Recent Shift Allocations */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 fade-in">
              <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>
                Recent Allocations
              </h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {shifts.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No shift allocations yet</p>
                ) : (
                  shifts.slice(0, 10).map(shift => (
                    <div
                      key={shift.id}
                      data-testid={`shift-card-${shift.id}`}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:bg-slate-700/50 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white font-medium">{shift.employee_name}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide border ${getShiftColor(shift.shift)}`}>
                          {shift.shift}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{shift.date}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

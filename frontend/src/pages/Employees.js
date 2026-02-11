import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sidebar } from '../components/Sidebar';
import { Users, Plus, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    role: 'Operator',
    shift: 'Morning',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API}/employees`);
      setEmployees(response.data);
    } catch (error) {
      toast.error('Failed to fetch employees');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(`${API}/employees`, formData);
      toast.success('Employee added successfully');
      setShowAddModal(false);
      setFormData({ name: '', role: 'Operator', shift: 'Morning' });
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      await axios.delete(`${API}/employees/${employeeId}`);
      toast.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      toast.error('Failed to delete employee');
      console.error(error);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'Supervisor':
        return 'bg-purple-900/50 text-purple-400 border-purple-800';
      case 'Operator':
        return 'bg-blue-900/50 text-blue-400 border-blue-800';
      default:
        return 'bg-slate-900/50 text-slate-400 border-slate-800';
    }
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
              Employee Management
            </h1>
            <p className="text-slate-400">Manage your workforce and team members</p>
          </div>

          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 fade-in">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                data-testid="search-employees-input"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-slate-500 transition-all duration-200"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              data-testid="add-employee-button"
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 uppercase tracking-wide text-sm whitespace-nowrap"
            >
              <Plus size={18} />
              Add Employee
            </button>
          </div>

          {/* Employees Table */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 uppercase text-xs font-bold tracking-wider">
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Role</th>
                    <th className="py-3 px-4 text-left">Shift</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 px-4 text-center text-slate-400">
                        {searchTerm ? 'No employees found matching your search.' : 'No employees found. Add your first employee to get started.'}
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <tr
                        key={employee.id}
                        data-testid={`employee-row-${employee.id}`}
                        className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors duration-150"
                      >
                        <td className="py-3 px-4 text-sm text-slate-300 font-medium">{employee.name}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide border ${getRoleColor(employee.role)}`}>
                            {employee.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide border ${getShiftColor(employee.shift)}`}>
                            {employee.shift}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            data-testid={`delete-employee-${employee.id}`}
                            onClick={() => handleDelete(employee.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-all duration-200"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <p className="text-slate-400 text-sm">
              Total Employees: <span className="font-bold text-white">{employees.length}</span>
            </p>
          </div>
        </div>
      </main>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl max-w-md w-full p-6 fade-in">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Users className="text-orange-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white uppercase" style={{ fontFamily: 'Oswald, sans-serif' }}>Add Employee</h2>
                <p className="text-slate-400 text-sm">Enter employee details</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="emp-name" className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">
                  Name
                </label>
                <input
                  id="emp-name"
                  data-testid="employee-name-input"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-slate-500 transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="emp-role" className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">
                  Role
                </label>
                <select
                  id="emp-role"
                  data-testid="employee-role-select"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="Operator">Operator</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>

              <div>
                <label htmlFor="emp-shift" className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">
                  Shift
                </label>
                <select
                  id="emp-shift"
                  data-testid="employee-shift-select"
                  value={formData.shift}
                  onChange={(e) => setFormData(prev => ({ ...prev, shift: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  data-testid="save-employee-button"
                  disabled={submitting}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-200 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  data-testid="cancel-employee-button"
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg border border-slate-600 transition-all duration-200 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

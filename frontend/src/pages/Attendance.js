import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sidebar } from '../components/Sidebar';
import { UserCheck, Search } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    employee_name: '',
    role: '',
    status: 'Present',
    date: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [employeesRes, attendanceRes] = await Promise.all([
        axios.get(`${API}/employees`),
        axios.get(`${API}/attendance`)
      ]);
      setEmployees(employeesRes.data);
      setAttendance(attendanceRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (e) => {
    const selectedId = e.target.value;
    const selectedEmployee = employees.find(emp => emp.id === selectedId);
    setFormData(prev => ({
      ...prev,
      employee_id: selectedId,
      employee_name: selectedEmployee?.name || '',
      role: selectedEmployee?.role || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employee_id) {
      toast.error('Please select an employee');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API}/attendance`, formData);
      toast.success('Attendance marked successfully');
      setShowMarkModal(false);
      setFormData({
        employee_id: '',
        employee_name: '',
        role: '',
        status: 'Present',
        date: new Date().toISOString().split('T')[0],
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAttendance = attendance.filter(record =>
    record.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-emerald-900/50 text-emerald-400 border-emerald-800';
      case 'Absent':
        return 'bg-red-900/50 text-red-400 border-red-800';
      default:
        return 'bg-slate-900/50 text-slate-400 border-slate-800';
    }
  };

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
              Employee Attendance
            </h1>
            <p className="text-slate-400">Track and manage employee attendance records</p>
          </div>

          {/* Search and Mark Attendance */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 fade-in">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                data-testid="search-attendance-input"
                placeholder="Search attendance records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-slate-500 transition-all duration-200"
              />
            </div>
            <button
              onClick={() => setShowMarkModal(true)}
              data-testid="mark-attendance-button"
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 uppercase tracking-wide text-sm whitespace-nowrap"
            >
              <UserCheck size={18} />
              Mark Attendance
            </button>
          </div>

          {/* Attendance Table */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 uppercase text-xs font-bold tracking-wider">
                    <th className="py-3 px-4 text-left">Employee Name</th>
                    <th className="py-3 px-4 text-left">Role</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 px-4 text-center text-slate-400">
                        {searchTerm ? 'No attendance records found matching your search.' : 'No attendance records found. Mark attendance to get started.'}
                      </td>
                    </tr>
                  ) : (
                    filteredAttendance.map((record) => (
                      <tr
                        key={record.id}
                        data-testid={`attendance-row-${record.id}`}
                        className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors duration-150"
                      >
                        <td className="py-3 px-4 text-sm text-slate-300 font-medium">{record.employee_name}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide border ${getRoleColor(record.role)}`}>
                            {record.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-300">{record.date}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide border ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
              <p className="text-slate-400 text-sm uppercase tracking-wide mb-1">Total Records</p>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>{attendance.length}</p>
            </div>
            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
              <p className="text-slate-400 text-sm uppercase tracking-wide mb-1">Present</p>
              <p className="text-2xl font-bold text-emerald-400" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {attendance.filter(r => r.status === 'Present').length}
              </p>
            </div>
            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
              <p className="text-slate-400 text-sm uppercase tracking-wide mb-1">Absent</p>
              <p className="text-2xl font-bold text-red-400" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {attendance.filter(r => r.status === 'Absent').length}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Mark Attendance Modal */}
      {showMarkModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl max-w-md w-full p-6 fade-in">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <UserCheck className="text-green-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white uppercase" style={{ fontFamily: 'Oswald, sans-serif' }}>Mark Attendance</h2>
                <p className="text-slate-400 text-sm">Record employee attendance</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="att-employee" className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">
                  Employee
                </label>
                <select
                  id="att-employee"
                  data-testid="attendance-employee-select"
                  value={formData.employee_id}
                  onChange={handleEmployeeChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} - {emp.role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="att-status" className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">
                  Status
                </label>
                <select
                  id="att-status"
                  data-testid="attendance-status-select"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div>
                <label htmlFor="att-date" className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">
                  Date
                </label>
                <input
                  id="att-date"
                  data-testid="attendance-date-input"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  data-testid="save-attendance-button"
                  disabled={submitting}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-200 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowMarkModal(false)}
                  data-testid="cancel-attendance-button"
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

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  BarChart3, 
  Users, 
  Clock, 
  UserCheck, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  Flame
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/add-batch', icon: Package, label: 'Add Batch' },
    { path: '/view-batches', icon: ClipboardList, label: 'View Batches' },
    { path: '/view-graph', icon: BarChart3, label: 'View Graph' },
    { path: '/employees', icon: Users, label: 'Employees' },
    { path: '/shift-allocation', icon: Clock, label: 'Shift Allocation' },
    { path: '/attendance', icon: UserCheck, label: 'Attendance' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        data-testid="mobile-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-700 z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Flame className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white uppercase tracking-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  Unique Shell
                </h1>
                <p className="text-xs text-slate-400 uppercase" style={{ fontFamily: 'Oswald, sans-serif' }}>Mould Systems</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`
                    }
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 uppercase">{user?.role}</p>
              </div>
            </div>
            <button
              data-testid="logout-button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

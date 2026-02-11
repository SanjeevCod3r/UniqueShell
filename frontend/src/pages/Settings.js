import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Settings as SettingsIcon, User, Bell, Shield, Database } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen industrial-bg">
        <div className="max-w-7xl mx-auto p-6 md:p-8">
          {/* Header */}
          <div className="mb-8 fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 uppercase tracking-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>
              Settings
            </h1>
            <p className="text-slate-400">Manage your account and application preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Settings */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-6 fade-in">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <User className="text-blue-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase" style={{ fontFamily: 'Oswald, sans-serif' }}>Profile Settings</h2>
                  <p className="text-slate-400 text-sm">Manage your personal information</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Name</label>
                  <input
                    type="text"
                    data-testid="settings-name-input"
                    value={user?.name || ''}
                    disabled
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-slate-400 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    data-testid="settings-email-input"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-slate-400 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Role</label>
                  <input
                    type="text"
                    data-testid="settings-role-input"
                    value={user?.role || ''}
                    disabled
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-slate-400 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-6 fade-in">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Bell className="text-orange-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase" style={{ fontFamily: 'Oswald, sans-serif' }}>Notifications</h2>
                  <p className="text-slate-400 text-sm">Configure notification preferences</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Email Notifications</p>
                    <p className="text-slate-400 text-sm">Receive updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Production Alerts</p>
                    <p className="text-slate-400 text-sm">Get notified about production updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-6 fade-in">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Shield className="text-red-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase" style={{ fontFamily: 'Oswald, sans-serif' }}>Security</h2>
                  <p className="text-slate-400 text-sm">Manage security settings</p>
                </div>
              </div>

              <button
                data-testid="change-password-button"
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 text-sm"
              >
                Change Password
              </button>
            </div>

            {/* System Info */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-6 fade-in">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Database className="text-green-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase" style={{ fontFamily: 'Oswald, sans-serif' }}>System Info</h2>
                  <p className="text-slate-400 text-sm">Application information</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Version</span>
                  <span className="text-white text-sm font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Environment</span>
                  <span className="text-white text-sm font-medium">Production</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Last Updated</span>
                  <span className="text-white text-sm font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

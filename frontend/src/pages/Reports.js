import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { FileText, Download, Calendar } from 'lucide-react';

export default function Reports() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen industrial-bg">
        <div className="max-w-7xl mx-auto p-6 md:p-8">
          {/* Header */}
          <div className="mb-8 fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 uppercase tracking-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>
              Reports
            </h1>
            <p className="text-slate-400">Generate and download production reports</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div data-testid="report-card-production" className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FileText className="text-blue-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase" style={{ fontFamily: 'Oswald, sans-serif' }}>Production Report</h3>
                  <p className="text-slate-400 text-sm">Batch production summary</p>
                </div>
              </div>
              <button
                data-testid="download-production-report"
                className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
              >
                <Download size={16} />
                Download
              </button>
            </div>

            <div data-testid="report-card-employee" className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <FileText className="text-purple-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase" style={{ fontFamily: 'Oswald, sans-serif' }}>Employee Report</h3>
                  <p className="text-slate-400 text-sm">Staff performance data</p>
                </div>
              </div>
              <button
                data-testid="download-employee-report"
                className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
              >
                <Download size={16} />
                Download
              </button>
            </div>

            <div data-testid="report-card-attendance" className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Calendar className="text-green-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase" style={{ fontFamily: 'Oswald, sans-serif' }}>Attendance Report</h3>
                  <p className="text-slate-400 text-sm">Monthly attendance log</p>
                </div>
              </div>
              <button
                data-testid="download-attendance-report"
                className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>

          <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm">
              <span className="font-bold text-white">Note:</span> Report generation functionality will be available soon. Stay tuned for updates.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

import React from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddBatch from './pages/AddBatch';
import ViewBatches from './pages/ViewBatches';
import ViewGraph from './pages/ViewGraph';
import Employees from './pages/Employees';
import ShiftAllocation from './pages/ShiftAllocation';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-batch"
              element={
                <ProtectedRoute>
                  <AddBatch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-batches"
              element={
                <ProtectedRoute>
                  <ViewBatches />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-graph"
              element={
                <ProtectedRoute>
                  <ViewGraph />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shift-allocation"
              element={
                <ProtectedRoute>
                  <ShiftAllocation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" theme="dark" richColors />
      </AuthProvider>
    </div>
  );
}

export default App;

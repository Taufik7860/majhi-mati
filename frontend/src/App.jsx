import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CitizenDashboard from './pages/CitizenDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/" element={<Login />} />

      {/* Citizen Protected Dashboard */}
      <Route element={<ProtectedRoute allowedRole="citizen" />}>
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
      </Route>

      {/* Officer Protected Dashboard */}
      <Route element={<ProtectedRoute allowedRole="officer" />}>
        <Route path="/officer/dashboard" element={<OfficerDashboard />} />
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
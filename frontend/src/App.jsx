import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CitizenDashboard from './pages/CitizenDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previous) => (previous === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-shell">
      <Routes>
        {/* Public Login Route */}
        <Route path="/" element={<Login isDark={theme === 'dark'} onToggleTheme={toggleTheme} />} />
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* Protected Citizen Dashboard */}
        <Route element={<ProtectedRoute allowedRole="citizen" />}>
          <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
        </Route>

        {/* Protected Officer Dashboard */}
        <Route element={<ProtectedRoute allowedRole="officer" />}>
          <Route path="/officer/dashboard" element={<OfficerDashboard />} />
        </Route>

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
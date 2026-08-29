import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ProtectedRoute({ allowedRole }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Supabase Session Check
        const { data: { session } } = await supabase.auth.getSession();
        
        // 2. Local Storage Backup Check
        const localUserData = localStorage.getItem('user');
        const localUser = localUserData ? JSON.parse(localUserData) : null;

        if (!session && !localUser) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        // Determine user role
        const activeRole = localUser?.role || 'citizen';
        
        setAuthenticated(true);
        setUserRole(activeRole);
      } catch (err) {
        console.error("Auth verification error:", err);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#0f2b48' }}>
        <h2>सत्यापन होत आहे... (Verifying Session...)</h2>
      </div>
    );
  }

  // Not logged in -> Redirect to Login Page
  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  // Role Mismatch -> Redirect to respective dashboard
  if (allowedRole && allowedRole !== userRole) {
    return userRole === 'officer' 
      ? <Navigate to="/officer/dashboard" replace /> 
      : <Navigate to="/citizen/dashboard" replace />;
  }

  return <Outlet />;
}
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ProtectedRoute({ allowedRole }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // 1. Read Local Storage Session
        const localUserData = localStorage.getItem('user');
        const localUser = localUserData ? JSON.parse(localUserData) : null;

        // 2. Check Supabase Auth Session
        const { data: { session } } = await supabase.auth.getSession();

        if (!session && !localUser) {
          if (isMounted) {
            setAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        const activeRole = localUser?.role || 'citizen';

        if (isMounted) {
          setAuthenticated(true);
          setUserRole(activeRole);
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth Check Error:", err);
        if (isMounted) {
          setAuthenticated(false);
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: 'sans-serif',
        color: '#0f2b48'
      }}>
        <h2>सत्यापन होत आहे... (Loading...)</h2>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && allowedRole !== userRole) {
    return userRole === 'officer' 
      ? <Navigate to="/officer/dashboard" replace /> 
      : <Navigate to="/citizen/dashboard" replace />;
  }

  return <Outlet />;
}
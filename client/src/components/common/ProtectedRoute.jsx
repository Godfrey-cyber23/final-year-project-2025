import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useToast } from '../../hooks/useToast';

const ProtectedRoute = ({ requiredRoles = [], children }) => {
  const location = useLocation();
  const { showToast } = useToast();
  const { 
    isAuthenticated, 
    loading, 
    user,
    verifySession,
    logout 
  } = useAuth();
  const [verifyingSession, setVerifyingSession] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Only verify session if we think we're authenticated
        if (isAuthenticated) {
          await verifySession();
        }
      } catch (error) {
        console.error('Session verification failed:', error);
        logout();
        showToast('Session expired. Please login again.', 'error');
      } finally {
        setVerifyingSession(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, verifySession, logout, showToast]);

  // Check if user has required roles
  const hasRequiredRole = requiredRoles.length === 0 || 
                         (user?.roles && requiredRoles.some(role => user.roles.includes(role))) ||
                         (user?.is_admin && requiredRoles.includes('admin'));

  if (loading || verifyingSession) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'background.default'
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Store the attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRequiredRole) {
    showToast('You do not have permission to access this page', 'error');
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorBoundary from '../../pages/Error/ErrorBoundary';
import { useToast } from '../../hooks/useToast';

const RoleRoute = ({ 
  adminOnly = false, 
  allowedRoles = [], 
  redirectPath = '/unauthorized',
  children 
}) => {
  const location = useLocation();
  const { lecturer, isLoading, error } = useAuth();
  const { showToast } = useToast();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    showToast('Authentication error. Please try again.', 'error');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!lecturer) {
    return <Navigate to="/login" state={{ from: location, error: 'Please login to access this page' }} replace />;
  }

  // Check access based on multiple conditions
  const hasAccess = () => {
    // If no specific requirements, just require authentication
    if (!adminOnly && allowedRoles.length === 0) return true;
    
    // Check admin privilege
    if (adminOnly && lecturer.is_admin === 1) return true;
    
    // Check allowed roles
    if (allowedRoles.length > 0) {
      return allowedRoles.some(role => 
        lecturer.roles?.includes(role) || 
        (role === 'admin' && lecturer.is_admin === 1)
      );
    }
    
    return false;
  };

  return (
    <ErrorBoundary fallback={<Navigate to="/500" state={{ from: location }} replace />}>
      {hasAccess() ? (
        children ? children : <Outlet />
      ) : (
        <Navigate 
          to={redirectPath} 
          state={{ 
            from: location,
            requiredRoles: adminOnly ? ['admin'] : allowedRoles,
            userRoles: lecturer.roles || []
          }} 
          replace 
        />
      )}
    </ErrorBoundary>
  );
};

export default RoleRoute;
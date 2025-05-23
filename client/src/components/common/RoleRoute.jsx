import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const RoleRoute = ({ adminOnly = false, redirectPath = '/unauthorized' }) => {
  const location = useLocation();
  const { lecturer, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!lecturer) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if route requires admin and user is admin
  const hasAccess = adminOnly ? lecturer.is_admin === 1 : true;

  return hasAccess ? (
    <Outlet />
  ) : (
    <Navigate to={redirectPath} state={{ from: location }} replace />
  );
};

export default RoleRoute;
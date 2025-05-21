 
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RoleRoute = ({ allowedRoles }) => {
  const { lecturer } = useAuth();

  return allowedRoles.includes(lecturer?.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};

export default RoleRoute;
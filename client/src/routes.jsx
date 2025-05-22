import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import ForgotPassword from '@/pages/Auth/ForgotPassword';
import ResetPassword from '@/pages/Auth/ResetPassword';
import Dashboard from '@/pages/Dashboard/Home';
import Monitoring from '@/pages/Dashboard/Monitoring';
import Reports from '@/pages/Dashboard/Reports';
import Users from '@/pages/Admin/Users';
import Settings from '@/pages/Admin/Settings';
import NotFound from '@/pages/Error/404';
import Unauthorized from '@/pages/Error/Unauthorized';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleRoute from './components/common/RoleRoute';
import { Home } from '@mui/icons-material';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/home" element={<Home />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/reports" element={<Reports />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* Dashboard Routes */}
          <Route index element={<Dashboard />} />
          {/* <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/home" element={<Home />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/reports" element={<Reports />} /> */}
          
          
          {/* Admin Routes - Only accessible by admin role */}
          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>
      
      {/* Catch all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
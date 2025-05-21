import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LecturerLogin from '@/pages/Auth/Login';
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
import ProtectedRoute from '@/components/common/ProtectedRoute';
import RoleRoute from '@/components/common/RoleRoute';
import Home from '@/pages/Dashboard/Home'; // Changed from MUI icon to your actual Home component

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/lecturer">
        {/* <Route path="/" element={<LecturerLogin />} /> */}
        <Route path="login" element={<LecturerLogin />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="home" element={<Layout><Home /></Layout>} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="monitoring" element={<Monitoring />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* Common Dashboard Routes */}
          <Route index element={<Dashboard />} />
          {/* <Route path="lecturer/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/home" element={<Home />} /> */}
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/monitoring" element={<Monitoring />} /> */}
          {/* <Route path="/reports" element={<Reports />} /> */}


          {/* Admin Routes */}
          <Route path="/admin">
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="users" element={<Users />} />
              {/* <Route path="settings" element={<Settings />} /> */}
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Catch all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
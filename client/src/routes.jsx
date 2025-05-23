import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Home } from '@mui/icons-material';
import { lazy, Suspense } from 'react';

// Auth Pages
const Login = lazy(() => import('@/pages/Auth/Login'));
const RegisterLecturer = lazy(() => import('@/pages/Auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/Auth/ResetPassword'));

// Dashboard Pages
const LecturerDashboard = lazy(() => import('@/pages/Dashboard/Home'));
const AdminDashboard = lazy(() => import('@/pages/Dashboard/AdminsDashboard'));
const Monitoring = lazy(() => import('@/pages/Dashboard/Monitoring'));
const Reports = lazy(() => import('@/pages/Dashboard/Reports'));

// Admin Pages
const Users = lazy(() => import('@/pages/Admin/Users'));
const Settings = lazy(() => import('@/pages/Admin/Settings'));

// Error Pages
const NotFound = lazy(() => import('@/pages/Error/404'));
const Unauthorized = lazy(() => import('@/pages/Error/Unauthorized'));

// Route Components
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleRoute from './components/common/RoleRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterLecturer />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/dashboard/home" element={<LecturerDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Dashboard Routes */}
            <Route index element={<LecturerDashboard />} />
            {/* <Route path="/dashboard/admin" element={<AdminDashboard />} /> */}
            <Route path="/dashboard/home" element={<AdminDashboard />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/reports" element={<Reports />} />
            
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
    </Suspense>
  );
};

export default AppRoutes;
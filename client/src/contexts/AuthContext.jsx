import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login as loginApi, getCurrentLecturer } from "../api/auth";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useToast } from "../hooks/useToast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [lecturer, setLecturer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  // Public routes that don't require authentication
  const publicRoutes = [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/register",
    "/home",
    "/unauthorized",
    "/verify-email",
  ];

  // Idle timeout (30 minutes)
  const IDLE_TIMEOUT = 30 * 60 * 1000;

  const handleAuthError = useCallback((err) => {
    const errorMsg = err.response?.data?.message || 
                    err.message || 
                    "Session expired. Please login again.";
    
    localStorage.removeItem("token");
    sessionStorage.removeItem("sessionToken");
    setLecturer(null);
    setError(errorMsg);

    showToast?.(errorMsg, 'error');

    if (!publicRoutes.some(route => location.pathname.startsWith(route))) {
      navigate("/login", {
        state: {
          from: location,
          error: errorMsg,
        },
        replace: true,
      });
    }
  }, [navigate, location, showToast]);

  const loadLecturer = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("sessionToken");
      if (!token) throw new Error("No authentication token found");

      const response = await getCurrentLecturer();
      
      if (!response?.data) {
        throw new Error("Invalid user data received");
      }

      setLecturer(response.data);
      setError(null);
      setLastActivity(Date.now());

      // Redirect to intended route after successful auth
      const redirectPath = location.state?.from?.pathname || 
                         (response.data.is_admin ? "/admin/dashboard" : "/dashboard");
      navigate(redirectPath, { replace: true });

    } catch (err) {
      if (err.name === 'AbortError') return;

      // Retry on server errors (status >= 500)
      if (err.response?.status >= 500 && retryCount < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return loadLecturer(retryCount + 1);
      }

      handleAuthError(err);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [navigate, location, handleAuthError]);

  // Track user activity for idle timeout
  useEffect(() => {
    const activities = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const updateActivity = () => setLastActivity(Date.now());

    activities.forEach(event => 
      window.addEventListener(event, updateActivity)
    );

    return () => {
      activities.forEach(event => 
        window.removeEventListener(event, updateActivity)
      );
    };
  }, []);

  // Check idle timeout
  useEffect(() => {
    const interval = setInterval(() => {
      if (lecturer && (Date.now() - lastActivity > IDLE_TIMEOUT)) {
        logout({ message: "You were logged out due to inactivity" });
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [lecturer, lastActivity]);

  // Initialize auth state
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const initializeAuth = async () => {
      if (publicRoutes.some(route => location.pathname.startsWith(route))) {
        setInitialized(true);
        setLoading(false);
        return;
      }
      await loadLecturer();
    };

    initializeAuth();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [loadLecturer, location.pathname]);

  const login = async (email, password, secret_key, rememberMe = false) => {
    try {
      setLoading(true);
      const response = await loginApi(email, password, secret_key);

      // Store token based on remember me preference
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", response.token);
      
      setLecturer(response.lecturer);
      setError(null);
      setLastActivity(Date.now());

      showToast?.("Login successful", 'success');

      return { success: true, lecturer: response.lecturer };
    } catch (err) {
      const errorMsg = err.response?.data?.message ||
                     err.message ||
                     "Login failed. Please check your credentials.";
      setError(errorMsg);
      
      showToast?.(errorMsg, 'error');

      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback((options = {}) => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("sessionToken");
    setLecturer(null);
    setError(null);

    const message = options.message || "You have been logged out";
    showToast?.(message, options.severity || 'info');

    navigate("/login", {
      state: {
        message,
        from: options.navigateBack ? location.pathname : undefined,
      },
      replace: true,
    });
  }, [navigate, location, showToast]);

  const refreshAuth = async () => {
    try {
      setLoading(true);
      const response = await getCurrentLecturer();
      if (!response?.data) {
        throw new Error("Invalid user data received");
      }
      setLecturer(response.data);
      setError(null);
      setLastActivity(Date.now());
      return true;
    } catch (err) {
      logout({ 
        message: "Session expired. Please login again.",
        severity: 'error'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    lecturer,
    isAuthenticated: !!lecturer,
    isAdmin: lecturer?.is_admin || false,
    departmentId: lecturer?.department_id || null,
    loading,
    error,
    initialized,
    login,
    logout,
    refreshAuth,
    setError,
    lastActivity,
    setLastActivity,
  };

  if (!initialized && !publicRoutes.some(route => location.pathname.startsWith(route))) {
    return <LoadingSpinner fullScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
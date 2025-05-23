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
    "/dashboard",
    "/unauthorized",
  ];

  const handleAuthError = useCallback((err) => {
    const errorMsg = err.response?.data?.message || 
                    err.message || 
                    "Session expired. Please login again.";
    
    localStorage.removeItem("token");
    setLecturer(null);
    setError(errorMsg);

    if (showToast) showToast(errorMsg, 'error');

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
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await getCurrentLecturer();
      
      setLecturer(response.data);
      setError(null);

      if (location.state?.from) {
        navigate(location.state.from, { replace: true });
      }
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

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const initializeAuth = async () => {
      await loadLecturer();
    };

    initializeAuth();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [loadLecturer]);

  const login = async (email, password, secret_key) => {
    try {
      setLoading(true);
      const response = await loginApi(email, password, secret_key);

      localStorage.setItem("token", response.token);
      setLecturer(response.lecturer);
      setError(null);

      if (showToast) showToast("Login successful", 'success');

      return { success: true, lecturer: response.lecturer };
    } catch (err) {
      const errorMsg = err.response?.data?.message ||
                     err.message ||
                     "Login failed. Please check your credentials.";
      setError(errorMsg);
      
      if (showToast) showToast(errorMsg, 'error');

      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback((options = {}) => {
    localStorage.removeItem("token");
    setLecturer(null);
    setError(null);

    const message = options.message || "You have been logged out";
    if (showToast) showToast(message, 'info');

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
      setLecturer(response.data);
      setError(null);
      return true;
    } catch (err) {
      logout({ message: "Session expired. Please login again." });
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
  };

  if (!initialized) {
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
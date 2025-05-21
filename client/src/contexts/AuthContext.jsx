import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  loginLecturer as loginLecturerApi,
  getCurrentLecturer
} from "../api/auth";
import LoadingSpinner from "../components/common/LoadingSpinner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [lecturer, setLecturer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const loadLecturer = async () => {
      try {
        const lecturerToken = localStorage.getItem("lecturerToken");
        
        if (!lecturerToken) {
          throw new Error("No authentication token found");
        }

        const response = await getCurrentLecturer();
        if (isMounted) {
          setLecturer(response.lecturer);
          setIsAdmin(response.lecturer?.is_admin || false);
          setError(null);

          if (location.state?.from) {
            navigate(location.state.from, { replace: true });
          } else if (!location.pathname.startsWith('/lecturer/')) {
            navigate('/lecturer/dashboard', { replace: true });
          }
        }
      } catch (err) {
        if (isMounted) {
          if (retryCount < maxRetries && err.response?.status >= 500) {
            retryCount++;
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * retryCount)
            );
            return loadLecturer();
          }

          localStorage.removeItem("lecturerToken");
          setError(
            err.response?.data?.message ||
              "Session expired. Please login again."
          );

          const publicRoutes = [
            "/lecturer/login",
            "/lecturer/register",
            "/lecturer/forgot-password"
          ];
          
          if (!publicRoutes.some(route => location.pathname.startsWith(route))) {
            navigate("/lecturer/login", {
              state: {
                from: location,
                error: err.response?.data?.message,
              },
            });
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    loadLecturer();

    return () => {
      isMounted = false;
    };
  }, [navigate, location]);

  const loginLecturer = async (email, password) => {
  try {
    const res = await axios.post('/auth/lecturer/login', { email, password });

    // Only on success
    localStorage.setItem('token', res.data.token);
    setLecturer(res.data.lecturer);

    return true;
  } catch (err) {
    return false; // Important: don't proceed
  }
};



  const logout = (options = {}) => {
    localStorage.removeItem("lecturerToken");
    setLecturer(null);
    setIsAdmin(false);
    setError(null);

    navigate("/lecturer/login", {
      state: {
        message: options.message || "You have been logged out",
        from: options.navigateBack ? location.pathname : undefined,
      },
      replace: true,
    });
  };

  const refreshAuth = async () => {
    try {
      setLoading(true);
      const response = await getCurrentLecturer();
      setLecturer(response.lecturer);
      setIsAdmin(response.lecturer?.is_admin || false);
      setError(null);
      return true;
    } catch (err) {
      logout({ message: "Session expired" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    lecturer,
    isAuthenticated: !!lecturer,
    isAdmin,
    loading,
    error,
    initialized,
    loginLecturer,
    logout,
    refreshAuth,
    setError,
  };

  if (!initialized) {
    return <LoadingSpinner />;
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
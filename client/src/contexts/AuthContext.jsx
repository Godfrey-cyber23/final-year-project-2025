import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login as loginApi, getCurrentUser } from "../api/auth";
import LoadingSpinner from "../components/common/LoadingSpinner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await getCurrentUser();
        if (isMounted) {
          setUser(response.data);
          setError(null);

          if (location.state?.from) {
            navigate(location.state.from, { replace: true });
          }
        }
      } catch (err) {
        if (isMounted) {
          if (retryCount < maxRetries && err.response?.status >= 500) {
            retryCount++;
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * retryCount)
            );
            return loadUser();
          }

          localStorage.removeItem("token");
          setError(
            err.response?.data?.message ||
              "Session expired. Please login again."
          );

          const publicRoutes = [
            "/login",
            "/register",
            "/forgot-password",
            "/reset-password",
          ];
          if (
            !publicRoutes.some((route) => location.pathname.startsWith(route))
          ) {
            navigate("/login", {
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

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [navigate, location]);

  const login = async (email, password) => {
  try {
    setLoading(true);
    const response = await loginApi(email, password);

    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
    setError(null);

    return {
      success: true,
      user: response.data.user,
    };
  } catch (err) {
    const errorMsg =
      err.response?.data?.message ||
      "Login failed. Please check your credentials.";
    setError(errorMsg);

    return {
      success: false,
      error: errorMsg,
    };
  } finally {
    setLoading(false);
  }
};

  const logout = (options = {}) => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null);

    navigate("/login", {
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
      const response = await getCurrentUser();
      setUser(response.data);
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
    user,
    isAuthenticated: !!user,
    loading,
    error,
    initialized,
    login,
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

import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { login } from "../../services/authService";
import { loginStyles } from "../../styles/loginStyles";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  Collapse,
  IconButton,
  CircularProgress,
  Tooltip,
  InputAdornment,
  IconButton as MuiIconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useToast } from "../../hooks/useToast";
import PasswordStrengthBar from "react-password-strength-bar";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    secret_key: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Check for existing session on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard/home");
    }
  }, [navigate]);

  // Handle account lock timer
  useEffect(() => {
    let timer;
    if (isAccountLocked && lockTimeRemaining > 0) {
      timer = setInterval(() => {
        setLockTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (lockTimeRemaining === 0 && isAccountLocked) {
      setIsAccountLocked(false);
    }
    return () => clearInterval(timer);
  }, [isAccountLocked, lockTimeRemaining]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleSecretKeyVisibility = () => {
    setShowSecretKey(!showSecretKey);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (isAccountLocked) {
      showToast(`Account locked. Try again in ${lockTimeRemaining} seconds`, "error");
      return;
    }

    setLoading(true);

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
        secret_key: formData.secret_key,
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      // Reset login attempts on success
      setLoginAttempts(0);
      
      // Store token and user data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.lecturer));

      showToast("Login successful", "success");

      // Redirect based on role
      if (response.lecturer.is_admin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard/home");
      }
    } catch (err) {
      const errorMsg = err.message || "Login failed. Please check your credentials.";
      setError(errorMsg);
      showToast(errorMsg, "error");
      
      // Handle account locking
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        setIsAccountLocked(true);
        setLockTimeRemaining(300); // 5 minutes lockout
        showToast("Account locked due to multiple failed attempts. Try again in 5 minutes.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Format time remaining for display
  const formatTimeRemaining = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Container maxWidth={false} sx={loginStyles.container}>
      <Box sx={loginStyles.formContainer}>
        <Box sx={loginStyles.header}>
          <img 
            src="/assets/images/unzaLogo.png" 
            alt="UNZA Logo" 
            style={{ height: '80px', marginBottom: '16px' }}
          />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            Lecturer Login
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Enter your credentials to access your account
          </Typography>
        </Box>

        <Collapse in={!!error}>
          <Alert
            severity="error"
            sx={loginStyles.alert}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setError("")}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        </Collapse>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Email Address"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            sx={loginStyles.textField}
            InputProps={{
              autoComplete: "username",
            }}
          />

          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={handleChange}
            sx={loginStyles.textField}
            InputProps={{
              autoComplete: "current-password",
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Department Secret Key"
            name="secret_key"
            type={showSecretKey ? "text" : "password"}
            required
            value={formData.secret_key}
            onChange={handleChange}
            sx={loginStyles.textField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle secret key visibility"
                    onClick={handleToggleSecretKeyVisibility}
                    edge="end"
                  >
                    {showSecretKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText="Contact your department administrator for the secret key"
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading || isAccountLocked}
            sx={{
              ...loginStyles.submitButton,
              mt: 3,
              mb: 2,
              bgcolor: isAccountLocked ? 'grey.500' : 'primary.main',
              '&:hover': {
                bgcolor: isAccountLocked ? 'grey.600' : 'primary.dark',
              }
            }}
            startIcon={isAccountLocked ? <LockResetIcon /> : null}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isAccountLocked ? (
              `Account Locked (${formatTimeRemaining(lockTimeRemaining)})`
            ) : (
              "Sign In"
            )}
          </Button>

          {loginAttempts > 0 && !isAccountLocked && (
            <Typography variant="caption" color="error" sx={{ display: 'block', textAlign: 'center' }}>
              {`${5 - loginAttempts} attempts remaining before account lock`}
            </Typography>
          )}
        </form>

        <Box sx={loginStyles.footerLinks}>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            <Link 
              component={RouterLink} 
              to="/forgot-password"
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <LockResetIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
              Forgot password?
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
            <Link
              component={RouterLink}
              to="/register"
              sx={{ color: "primary.main" }}
            >
              Don't have an account? Register
            </Link>
          </Typography>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            By logging in, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
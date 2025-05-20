import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { loginStyles } from "../../styles/loginStyles";
import { Link as RouterLink } from 'react-router-dom'; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter a valid email address");
      return;
    }

    if (isAdmin && !adminKey) {
      setFormError("Please enter admin  secret key");
      return;
    }

    setIsSubmitting(true);
    const { success, error } = await login(
      email,
      password,
      isAdmin ? adminKey : null
    );
    setIsSubmitting(false);

    if (success) {
      navigate(location.state?.from || "/dashboard", { replace: true });
    } else {
      setFormError(error || "Login failed. Please try again.");
    }
  };

  return (
    <Container maxWidth={false} sx={loginStyles.container}>
  <Box sx={loginStyles.formContainer}>
        <Box sx={loginStyles.header}>
          <img
            src="/assets/images/unzaLogo.png"
            alt="University Logo"
            style={{
              height: 80,
              marginBottom: 16,
              filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))",
            }}
          />
          <Typography variant="h5" component="h1" gutterBottom>
            Exam Security System
          </Typography>
          <Typography variant="body2" color="text.secondary">
            University of Zambia - Final Year Project
          </Typography>
        </Box>

        {formError && (
          <Alert severity="error" sx={loginStyles.alert}>
            {formError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email Address"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!formError}
            autoComplete="email"
            autoFocus
            sx={loginStyles.textField}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!formError}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={loginStyles.textField}
          />

          {isAdmin && (
            <TextField
              fullWidth
              margin="normal"
              label="Admin Secret Key"
              variant="outlined"
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              error={!!formError}
              sx={loginStyles.adminTextField}
            />
          )}

          <Box sx={loginStyles.adminToggle}>
            <Button size="small" onClick={() => setIsAdmin(!isAdmin)}>
              {isAdmin ? "Regular User Login" : "Admin Login"}
            </Button>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={loginStyles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <Box sx={loginStyles.footerLinks}>
  <Typography variant="body2">
    <Link 
      component={RouterLink} 
      to="/forgot-password"
      sx={{ 
        color: '#3498db',
        textDecoration: 'none',
        fontWeight: '500',
        fontSize: '0.8rem',
        '&:hover': {
          textDecoration: 'underline'
        }
      }}
    >
      Forgot password?
    </Link>
  </Typography>
  <Typography variant="body2">
    <Link 
      component={RouterLink} 
      to="/register"
      sx={{
        color: '#3498db',
        textDecoration: 'none',
        fontWeight: '500',
        fontSize: '0.8rem',
        '&:hover': {
          textDecoration: 'underline'
        }
      }}
    >
      Don't have an account? Register
    </Link>
  </Typography>
</Box>
      </Box>
    </Container>
  );
};

export default Login;

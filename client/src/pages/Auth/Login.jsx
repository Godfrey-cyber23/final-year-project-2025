import React, { useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    secret_key: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
        secret_key: formData.secret_key,
        role: "lecturer",
      });

      // Store the token and user data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirect based on role
      if (response.user.is_admin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/lecturer/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={false} sx={loginStyles.container}>
      <Box sx={loginStyles.formContainer}>
        <Box sx={loginStyles.header}>
          <img src="public/assets/images/unzaLogo.png"></img>
          <Typography variant="h5" component="h1">
            Lecturer Login
          </Typography>
          <Typography variant="body2">
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
          />

          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            sx={loginStyles.textField}
          />

          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Department Secret Key"
            name="secret_key"
            type="password"
            required
            value={formData.secret_key}
            onChange={handleChange}
            sx={loginStyles.textField}
            helperText="Contact your department administrator for the secret key"
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={loginStyles.submitButton}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <Box sx={loginStyles.footerLinks}>
          <Typography variant="body2">
            <Link component={RouterLink} to="/forgot-password">
              Forgot password?
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link
              component={RouterLink}
              to="/register"
              sx={{ color: "primary.main" }}
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

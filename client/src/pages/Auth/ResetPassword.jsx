import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  LockReset as LockResetIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { resetPassword } from '../../services/authService';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Validate token on component mount
  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token]);

  // Password validation
  useEffect(() => {
    if (password.length > 0 && password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else if (password.length >= 8 && !/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter');
    } else if (password.length >= 8 && !/[0-9]/.test(password)) {
      setPasswordError('Password must contain at least one number');
    } else if (password.length >= 8 && !/[^A-Za-z0-9]/.test(password)) {
      setPasswordError('Password must contain at least one special character');
    } else {
      setPasswordError('');
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordError) {
      setError('Please fix password requirements');
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(token, password);
      if (response.success) {
        setSuccess(true);
        // Auto-redirect after 3 seconds
        setTimeout(() => navigate('/login', { state: { passwordReset: true } }), 3000);
      } else {
        setError(response.error || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.response?.data?.message || 
              err.message || 
              'Failed to reset password. Please try again.');
      
      // If token is invalid/expired, clear it
      if (err.response?.status === 401 || err.response?.status === 404) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="xs" sx={{ 
      mt: 8,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '80vh',
      justifyContent: 'center'
    }}>
      <Paper elevation={3} sx={{ 
        p: 4,
        borderRadius: 2,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <Box textAlign="center" mb={3}>
          <LockResetIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Reset Your Password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please enter your new password below
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success ? (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>
              Your password has been successfully reset. Redirecting to login...
            </Alert>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/login', { state: { passwordReset: true } })}
              sx={{ mt: 2 }}
            >
              Go to Login Now
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
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
              inputProps={{
                minLength: 8,
                'data-testid': 'new-password-input'
              }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                'data-testid': 'confirm-password-input'
              }}
              sx={{ mb: 2 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !token || !!passwordError}
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                fontSize: '1rem'
              }}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
            
            <Box textAlign="center" mt={2}>
              <Button 
                onClick={() => navigate('/login')} 
                color="primary"
                size="small"
              >
                Back to Login
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPassword;
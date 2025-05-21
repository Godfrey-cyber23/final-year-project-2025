import { useState } from 'react';
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
  useTheme
} from '@mui/material';
import { LockReset as LockResetIcon } from '@mui/icons-material';
import { resetLecturerPassword } from '../../services/authService';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await resetLecturerPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth="xs" 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          width: '100%',
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[4]
        }}
      >
        <Box textAlign="center" mb={3}>
          <LockResetIcon 
            color="primary" 
            sx={{ 
              fontSize: 40,
              mb: 1,
              backgroundColor: theme.palette.primary.light,
              borderRadius: '50%',
              p: 1,
              color: theme.palette.primary.main
            }} 
          />
          <Typography variant="h5" component="h1">
            Lecturer Password Reset
          </Typography>
        </Box>

        {success ? (
          <>
            <Alert severity="success" sx={{ mb: 3 }}>
              Your password has been successfully reset.
            </Alert>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/lecturer/login')}
              sx={{ mt: 2 }}
            >
              Back to Login
            </Button>
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="New Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Minimum 8 characters"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Confirm New Password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  py: 1.5,
                  fontSize: '1rem'
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPassword;
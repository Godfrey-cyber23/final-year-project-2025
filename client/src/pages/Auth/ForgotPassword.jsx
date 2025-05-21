import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Link,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
import { forgotLecturerPassword } from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    
    try {
      await forgotLecturerPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
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
          <EmailIcon 
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
          <Typography variant="h5" component="h1" gutterBottom>
            Lecturer Password Reset
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your registered email to receive a reset link
          </Typography>
        </Box>

        {success ? (
          <>
            <Alert severity="success" sx={{ mb: 3 }}>
              We've sent a password reset link to your email address.
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
                label="Lecturer Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                sx={{ mb: 2 }}
              />
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ 
                  mt: 1,
                  py: 1.5,
                  fontSize: '1rem'
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>

            <Box textAlign="center" mt={3}>
              <Link 
                component={RouterLink} 
                to="/lecturer/login"
                sx={{ 
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Remember your password? Sign in
              </Link>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
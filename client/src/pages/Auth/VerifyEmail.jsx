import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmailToken } from '@/services/authService';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Button,
  Alert,
  AlertTitle 
} from '@mui/material';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import ErrorBoundary from './pages/Error/ErrorBoundary';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          throw new Error('Verification token is missing');
        }

        const response = await verifyEmailToken(token);
        
        if (response.success) {
          setStatus('verified');
          // Refresh auth state if user is logged in
          await refreshAuth();
        } else {
          throw new Error(response.error || 'Email verification failed');
        }
      } catch (err) {
        console.error('Email verification error:', err);
        setError(err.message);
        setStatus('failed');
      }
    };

    verifyToken();
  }, [token, refreshAuth]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Verifying your email...
            </Typography>
          </Box>
        );
      
      case 'verified':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircleOutline sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Email Verified Successfully!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Your email address has been successfully verified. You can now access all features.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </Box>
        );
      
      case 'failed':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <ErrorOutline sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Verification Failed
            </Typography>
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              <AlertTitle>Error</AlertTitle>
              {error || 'The verification link is invalid or has expired.'}
            </Alert>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/resend-verification')}
              >
                Resend Verification
              </Button>
            </Box>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          p: 3
        }}
      >
        {renderContent()}
      </Box>
    </ErrorBoundary>
  );
};

export default VerifyEmail;
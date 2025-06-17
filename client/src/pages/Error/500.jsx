import { Component } from 'react';
import { Typography, Button, Container } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      // If a fallback is provided, use it
      if (fallback) return fallback;
      
      // Otherwise, render the default error UI
      return <ErrorBoundaryFallback error={error} />;
    }

    return children;
  }
}

// Default fallback component when no fallback is provided
const ErrorBoundaryFallback = ({ error }) => {
  const location = useLocation();
  const { showToast } = useToast();

  // Optionally show a toast notification
  showToast('Something went wrong. Please try again.', 'error');

  return (
    <Container sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h1" gutterBottom>500</Typography>
      <Typography variant="h4" gutterBottom>Something Went Wrong</Typography>
      <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
        {error?.message || 'An unexpected error occurred.'}
      </Typography>
      <Button 
        component={Link} 
        to="/" 
        state={{ from: location }} 
        variant="contained" 
        sx={{ mt: 3 }}
      >
        Return to Dashboard
      </Button>
    </Container>
  );
};

export default ErrorBoundary;
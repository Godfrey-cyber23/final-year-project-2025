import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Box, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log error to error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Example: Send error to logging service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3,
            textAlign: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Something went wrong
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            {this.state.error?.toString() || 'An unexpected error occurred'}
          </Typography>

          {this.props.showDetails && (
            <Box
              sx={{
                p: 2,
                mb: 3,
                maxWidth: '100%',
                overflow: 'auto',
                backgroundColor: 'grey.100',
                borderRadius: 1
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Error Details:
              </Typography>
              <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {this.state.errorInfo?.componentStack}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleReset}
              sx={{ mb: 2 }}
            >
              Try Again
            </Button>
            
            <Button
              variant="outlined"
              color="primary"
              onClick={() => window.location.reload()}
              sx={{ mb: 2 }}
            >
              Refresh Page
            </Button>
            
            {this.props.showHomeButton && (
              <Button
                variant="text"
                color="primary"
                onClick={() => this.props.navigate?.('/')}
                sx={{ mb: 2 }}
              >
                Go to Home
              </Button>
            )}
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.element,
  onReset: PropTypes.func,
  showDetails: PropTypes.bool,
  showHomeButton: PropTypes.bool,
  navigate: PropTypes.func
};

ErrorBoundary.defaultProps = {
  showDetails: process.env.NODE_ENV === 'development',
  showHomeButton: true
};

// Wrapper component to provide navigation
const ErrorBoundaryWithNavigation = (props) => {
  const navigate = useNavigate();
  return <ErrorBoundary {...props} navigate={navigate} />;
};

export default ErrorBoundaryWithNavigation;
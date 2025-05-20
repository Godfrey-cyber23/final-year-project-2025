 
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      textAlign: 'center',
      p: 3
    }}>
      <LockIcon sx={{ fontSize: 100, mb: 2, color: 'error.main' }} />
      <Typography variant="h3" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        You don't have permission to view this page
      </Typography>
      <Button 
        variant="contained" 
        component={Link} 
        to="/"
        size="large"
      >
        Return to Dashboard
      </Button>
    </Box>
  );
};

export default Unauthorized; // Proper default export
 
import React from 'react';
import { Box, Typography, Paper, Switch, FormControlLabel } from '@mui/material';

// Correct export syntax
const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        System Settings
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
            />
          }
          label="Enable Email Notifications"
        />
      </Paper>

      {/* Add more settings components */}
    </Box>
  );
};

// Add default export
export default Settings;
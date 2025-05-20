 
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const SeverityStats = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Severity Stats</Typography>
        <Typography variant="body2">Mild: 12</Typography>
        <Typography variant="body2">Moderate: 7</Typography>
        <Typography variant="body2">Severe: 3</Typography>
      </CardContent>
    </Card>
  );
};

export default SeverityStats;

 
import React from 'react';
import { Card, CardContent, Typography, List, ListItem } from '@mui/material';

const DetectionLog = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Detection Log</Typography>
        <List>
          <ListItem>Student A - Suspicious behavior</ListItem>
          <ListItem>Student B - Unauthorized object</ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default DetectionLog;

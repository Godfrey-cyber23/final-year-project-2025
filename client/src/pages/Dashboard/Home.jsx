 
import React from 'react';
import { Grid, Paper, Typography, useTheme } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDetection } from '../../contexts/DetectionContext';
import SeverityIndicator from '../../components/detection/SeverityIndicator';
import { 
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent
} from '@mui/lab';

const mockChartData = [
  { time: '00:00', detections: 2 },
  { time: '04:00', detections: 0 },
  { time: '08:00', detections: 5 },
  { time: '12:00', detections: 8 },
  { time: '16:00', detections: 3 },
  { time: '20:00', detections: 6 },
];

const Home = () => {
    const { loading } = useAuth();
  const theme = useTheme();
  const { detections } = useDetection();

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const stats = {
    totalDetections: detections.length,
    highSeverity: detections.filter(d => d.severity === 'high').length,
    avgResponseTime: '2.4m', // Mock data
    systemStatus: 'Operational'
  };

  return (
    <Grid container spacing={3}>
      {/* System Status Row */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">System Status</Typography>
          <SeverityIndicator />
          <Typography variant="body1" color="textSecondary">
            Last updated: {new Date().toLocaleTimeString()}
          </Typography>
        </Paper>
      </Grid>

      {/* Statistics Cards */}
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">Total Detections</Typography>
          <Typography variant="h3">{stats.totalDetections}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">High Severity</Typography>
          <Typography variant="h3" color="error">{stats.highSeverity}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">Avg Response</Typography>
          <Typography variant="h3">{stats.avgResponseTime}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">System Status</Typography>
          <Typography variant="h3" color="success.main">{stats.systemStatus}</Typography>
        </Paper>
      </Grid>

      {/* Detection Chart */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2, height: 300 }}>
          <Typography variant="h6" gutterBottom>Detection Trends</Typography>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="detections" 
                stroke={theme.palette.primary.main}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Recent Activity Timeline */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: 300, overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>Recent Activity</Typography>
          <Timeline position="alternate">
            {detections.slice(-5).reverse().map((detection, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent color="textSecondary">
                  {new Date(detection.timestamp).toLocaleTimeString()}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={
                    detection.severity === 'high' ? 'error' : 
                    detection.severity === 'medium' ? 'warning' : 'success'
                  } />
                  {index < 4 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography>{detection.type}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {detection.location}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Home;
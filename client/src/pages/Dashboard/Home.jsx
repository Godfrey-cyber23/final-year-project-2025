import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  useTheme,
  Box,
  CircularProgress,
  CssBaseline,
  Divider,
  Toolbar
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  BarChart as AnalyticsIcon,
  Timeline as TimelineIcon,
  People as UsersIcon,
  Devices as DevicesIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDetection } from '../../contexts/DetectionContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const stats = React.useMemo(() => ({
    totalDetections: detections.length,
    highSeverity: detections.filter(d => d.severity === 'high').length,
    avgResponseTime: '2.4m',
    systemStatus: 'Operational'
  }), [detections]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Spacer for app bar */}
        
        <Grid container spacing={3}>
          {/* System Status Row */}
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 3, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderRadius: 2,
              boxShadow: theme.shadows[3],
              background: theme.palette.background.paper
            }}>
              <Typography variant="h5" fontWeight="medium">System Status</Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <SeverityIndicator />
                <Typography variant="body1" color="text.secondary">
                  Last updated: {new Date().toLocaleTimeString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Statistics Cards */}
          {[
            { title: 'Total Detections', value: stats.totalDetections, color: 'primary' },
            { title: 'High Severity', value: stats.highSeverity, color: 'error' },
            { title: 'Avg Response', value: stats.avgResponseTime, color: 'info' },
            { title: 'System Status', value: stats.systemStatus, color: 'success' }
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper sx={{ 
                p: 2, 
                textAlign: 'center',
                borderRadius: 2,
                boxShadow: theme.shadows[2],
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4]
                }
              }}>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography 
                  variant="h3" 
                  color={`${stat.color}.main`}
                  fontWeight="bold"
                >
                  {stat.value}
                </Typography>
              </Paper>
            </Grid>
          ))}

          {/* Detection Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ 
              p: 3, 
              height: 400,
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              background: theme.palette.background.paper
            }}>
              <Typography variant="h6" gutterBottom fontWeight="medium">
                Detection Trends
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <YAxis 
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      borderColor: theme.palette.divider,
                      borderRadius: theme.shape.borderRadius
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="detections" 
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Recent Activity Timeline */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ 
              p: 3, 
              height: 400, 
              overflow: 'auto',
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              background: theme.palette.background.paper
            }}>
              <Typography variant="h6" gutterBottom fontWeight="medium">
                Recent Activity
              </Typography>
              <Timeline position="alternate" sx={{ p: 0 }}>
                {detections.slice(-5).reverse().map((detection, index) => (
                  <TimelineItem key={index}>
                    <TimelineOppositeContent
                      sx={{ m: 'auto 0' }}
                      variant="body2"
                      color="text.secondary"
                    >
                      {new Date(detection.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot 
                        color={
                          detection.severity === 'high' ? 'error' : 
                          detection.severity === 'medium' ? 'warning' : 'success'
                        } 
                        variant="outlined"
                        sx={{ borderWidth: 2 }}
                      />
                      {index < 4 && (
                        <TimelineConnector sx={{ 
                          backgroundColor: theme.palette.grey[300] 
                        }} />
                      )}
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {detection.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {detection.location}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
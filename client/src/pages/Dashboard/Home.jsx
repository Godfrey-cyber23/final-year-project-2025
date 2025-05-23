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
  Toolbar,
  Avatar,
  Stack,
  Chip
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Assignment as ExamsIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  BarChart as AnalyticsIcon,
  Schedule as ScheduleIcon,
  People as StudentsIcon,
  Class as CoursesIcon,
  Notifications as NotificationsIcon,
  EventAvailable as AttendanceIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent
} from '@mui/lab';

const mockExamData = [
  { date: 'Mon', exams: 2 },
  { date: 'Tue', exams: 3 },
  { date: 'Wed', exams: 1 },
  { date: 'Thu', exams: 4 },
  { date: 'Fri', exams: 2 },
  { date: 'Sat', exams: 0 },
];

const recentActivities = [
  { time: '08:30 AM', action: 'Created CS101 Midterm', type: 'exam' },
  { time: '10:15 AM', action: 'Updated security settings', type: 'security' },
  { time: '01:45 PM', action: 'Reviewed suspicious activity', type: 'monitoring' },
  { time: '03:20 PM', action: 'Scheduled final exams', type: 'schedule' },
];

const LecturerDashboard = () => {
  const { user, loading } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: theme.palette.background.default
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const stats = [
    { title: 'Upcoming Exams', value: 5, icon: <ExamsIcon fontSize="large" color="primary" /> },
    { title: 'Courses', value: 3, icon: <CoursesIcon fontSize="large" color="secondary" /> },
    { title: 'Students', value: 142, icon: <StudentsIcon fontSize="large" color="success" /> },
    { title: 'Security Alerts', value: 2, icon: <SecurityIcon fontSize="large" color="warning" /> }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.palette.grey[50] }}>
      <CssBaseline />
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Spacer for app bar */}
        
        {/* Welcome Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="medium" gutterBottom>
            Welcome, Dr. {user?.lastName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your exams today
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {/* Quick Stats */}
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper sx={{ 
                p: 3, 
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                borderRadius: 2,
                boxShadow: theme.shadows[2],
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4]
                }
              }}>
                <Avatar sx={{ 
                  width: 56, 
                  height: 56,
                  backgroundColor: `${stat.icon.props.color}.light`,
                  color: `${stat.icon.props.color}.dark`
                }}>
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stat.value}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}

          {/* Exam Schedule Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ 
              p: 3, 
              height: 350,
              borderRadius: 2,
              boxShadow: theme.shadows[2],
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}>
                <Typography variant="h6" fontWeight="medium">
                  Upcoming Exams This Week
                </Typography>
                <Chip 
                  icon={<ScheduleIcon />} 
                  label="View All" 
                  clickable
                  onClick={() => navigate('/exams')}
                />
              </Box>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={mockExamData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis 
                    dataKey="date" 
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
                    dataKey="exams" 
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ 
              p: 3, 
              height: 350, 
              overflow: 'auto',
              borderRadius: 2,
              boxShadow: theme.shadows[2],
            }}>
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Recent Activities
              </Typography>
              <Timeline sx={{ p: 0 }}>
                {recentActivities.map((activity, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot color={
                        activity.type === 'exam' ? 'primary' :
                        activity.type === 'security' ? 'warning' :
                        activity.type === 'monitoring' ? 'error' : 'success'
                      }>
                        {activity.type === 'exam' && <ExamsIcon fontSize="small" />}
                        {activity.type === 'security' && <SecurityIcon fontSize="small" />}
                        {activity.type === 'monitoring' && <NotificationsIcon fontSize="small" />}
                        {activity.type === 'schedule' && <ScheduleIcon fontSize="small" />}
                      </TimelineDot>
                      {index < recentActivities.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2" color="text.secondary">
                        {activity.time}
                      </Typography>
                      <Typography variant="body1">
                        {activity.action}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 2,
              boxShadow: theme.shadows[2],
            }}>
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                {[
                  { icon: <ExamsIcon />, label: 'Create Exam', color: 'primary', path: '/exams/create' },
                  { icon: <AttendanceIcon />, label: 'Take Attendance', color: 'secondary', path: '/attendance' },
                  { icon: <AnalyticsIcon />, label: 'View Reports', color: 'info', path: '/analytics' },
                  { icon: <SecurityIcon />, label: 'Security Settings', color: 'warning', path: '/security' },
                  { icon: <SettingsIcon />, label: 'System Settings', color: 'inherit', path: '/settings' },
                ].map((action, index) => (
                  <Grid item xs={6} sm={4} md={2.4} key={index}>
                    <Paper 
                      onClick={() => navigate(action.path)}
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          backgroundColor: theme.palette.action.hover
                        }
                      }}
                    >
                      <Avatar sx={{ 
                        mb: 1,
                        backgroundColor: `${action.color}.light`,
                        color: `${action.color}.dark`
                      }}>
                        {action.icon}
                      </Avatar>
                      <Typography variant="body2" textAlign="center">
                        {action.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LecturerDashboard;
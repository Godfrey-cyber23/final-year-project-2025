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
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  BarChart as AnalyticsIcon,
  People as UsersIcon,
  School as LecturersIcon,
  Groups as StudentsIcon,
  Assignment as ExamsIcon,
  Notifications as NotificationsIcon,
  Warning as AlertsIcon,
  EventNote as LogsIcon,
  Devices as DevicesIcon,
  Lock as PermissionsIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent
} from '@mui/lab';
import { Warning, People } from '@mui/icons-material';

const mockSystemData = [
  { time: '00:00', usage: 30, threats: 2 },
  { time: '04:00', usage: 15, threats: 0 },
  { time: '08:00', usage: 65, threats: 3 },
  { time: '12:00', usage: 80, threats: 5 },
  { time: '16:00', usage: 70, threats: 1 },
  { time: '20:00', usage: 45, threats: 2 },
];

const recentAlerts = [
  { id: 1, time: '10:30 AM', severity: 'high', message: 'Multiple login attempts detected', resolved: false },
  { id: 2, time: '09:15 AM', severity: 'medium', message: 'Exam paper accessed from unusual location', resolved: true },
  { id: 3, time: '08:45 AM', severity: 'low', message: 'New lecturer account created', resolved: true },
  { id: 4, time: 'Yesterday', severity: 'high', message: 'System maintenance required', resolved: false },
];

const adminTasks = [
  { id: 1, title: 'Review pending lecturer accounts', priority: 'high', assigned: 'You' },
  { id: 2, title: 'Update exam security policies', priority: 'medium', assigned: 'Team' },
  { id: 3, title: 'Generate monthly reports', priority: 'low', assigned: 'You' },
  { id: 4, title: 'Audit system permissions', priority: 'medium', assigned: 'Team' },
];

const AdminDashboard = () => {
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
    { title: 'Active Users', value: '1,248', icon: <UsersIcon fontSize="large" color="primary" />, trend: 'up' },
    { title: 'Lecturers', value: '86', icon: <LecturersIcon fontSize="large" color="secondary" />, trend: 'steady' },
    { title: 'Students', value: '5,742', icon: <StudentsIcon fontSize="large" color="success" />, trend: 'up' },
    { title: 'Active Exams', value: '24', icon: <ExamsIcon fontSize="large" color="warning" />, trend: 'down' },
    { title: 'Security Alerts', value: '5', icon: <AlertsIcon fontSize="large" color="error" />, trend: 'up' },
    { title: 'System Health', value: '98%', icon: <DevicesIcon fontSize="large" color="info" />, trend: 'steady' }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.palette.grey[50] }}>
      <CssBaseline />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Spacer for app bar */}

        {/* Admin Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <AdminIcon color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" fontWeight="medium">
                Admin Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                System overview and management console
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {/* System Stats */}
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <Paper sx={{
                p: 2,
                height: '100%',
                borderRadius: 2,
                boxShadow: theme.shadows[2],
                borderLeft: `4px solid ${theme.palette[stat.icon.props.color].main}`,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4]
                }
              }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: `${stat.icon.props.color}.light`,
                    color: `${stat.icon.props.color}.dark`
                  }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color={
                      stat.trend === 'up' ? 'success.main' :
                      stat.trend === 'down' ? 'error.main' : 'text.secondary'
                    }>
                      {stat.trend === 'up' ? '↑ 5.2%' : stat.trend === 'down' ? '↓ 2.1%' : '↔ Stable'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}

          {/* System Performance Chart */}
          <Grid item xs={12} lg={8}>
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
                  System Performance & Threats
                </Typography>
                <Chip
                  icon={<AnalyticsIcon />}
                  label="View Detailed Analytics"
                  clickable
                  onClick={() => navigate('/admin/analytics')}
                />
              </Box>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={mockSystemData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
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
                    yAxisId="left"
                    type="monotone"
                    dataKey="usage"
                    name="System Usage %"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="threats"
                    name="Security Threats"
                    stroke={theme.palette.error.main}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Recent Alerts */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{
              p: 3,
              height: 350,
              overflow: 'auto',
              borderRadius: 2,
              boxShadow: theme.shadows[2],
            }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="h6" fontWeight="medium">
                  Security Alerts
                </Typography>
                <Badge badgeContent={recentAlerts.filter(a => !a.resolved).length} color="error">
                  <AlertsIcon color="action" />
                </Badge>
              </Box>
              <List dense>
                {recentAlerts.map((alert) => (
                  <ListItem
                    key={alert.id}
                    button
                    onClick={() => navigate(`/admin/alerts/${alert.id}`)}
                    sx={{
                      mb: 1,
                      borderRadius: 1,
                      backgroundColor: alert.resolved ? 'transparent' : 'action.hover',
                      borderLeft: `3px solid ${
                        alert.severity === 'high' ? theme.palette.error.main :
                        alert.severity === 'medium' ? theme.palette.warning.main :
                        theme.palette.success.main
                      }`
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{
                        width: 32,
                        height: 32,
                        bgcolor:
                          alert.severity === 'high' ? 'error.light' :
                          alert.severity === 'medium' ? 'warning.light' : 'success.light',
                        color:
                          alert.severity === 'high' ? 'error.dark' :
                          alert.severity === 'medium' ? 'warning.dark' : 'success.dark'
                      }}>
                        {alert.severity === 'high' ? <Warning /> :
                         alert.severity === 'medium' ? <NotificationsIcon /> : <SecurityIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={alert.message}
                      secondary={alert.time}
                      primaryTypographyProps={{
                        fontWeight: alert.resolved ? 'normal' : 'medium',
                        color: alert.resolved ? 'text.secondary' : 'text.primary'
                      }}
                    />
                    {!alert.resolved && (
                      <Chip label="Action Required" size="small" color="error" />
                    )}
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Admin Tasks */}
          <Grid item xs={12} md={6}>
            <Paper sx={{
              p: 3,
              height: '100%',
              borderRadius: 2,
              boxShadow: theme.shadows[2],
            }}>
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Your Admin Tasks
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Timeline sx={{ p: 0 }}>
                {adminTasks.map((task, index) => (
                  <TimelineItem key={task.id}>
                    <TimelineSeparator>
                      <TimelineDot color={
                        task.priority === 'high' ? 'error' :
                        task.priority === 'medium' ? 'warning' : 'success'
                      }>
                        {index === 0 && <AdminIcon fontSize="small" />}
                        {index === 1 && <PermissionsIcon fontSize="small" />}
                        {index === 2 && <AnalyticsIcon fontSize="small" />}
                        {index === 3 && <SettingsIcon fontSize="small" />}
                      </TimelineDot>
                      {index < adminTasks.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Typography variant="body1" fontWeight="medium">
                          {task.title}
                        </Typography>
                        <Chip
                          label={task.assigned}
                          size="small"
                          color={task.assigned === 'You' ? 'primary' : 'default'}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Priority: {task.priority}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Paper>
          </Grid>

          {/* User Activity */}
          <Grid item xs={12} md={6}>
            <Paper sx={{
              p: 3,
              height: '100%',
              borderRadius: 2,
              boxShadow: theme.shadows[2],
            }}>
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Recent User Activity
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: 'Lecturers', active: 42, total: 86 },
                    { name: 'Students', active: 1248, total: 5742 },
                    { name: 'Admins', active: 3, total: 5 }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="name" tick={{ fill: theme.palette.text.secondary }} />
                  <YAxis tick={{ fill: theme.palette.text.secondary }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      borderColor: theme.palette.divider,
                      borderRadius: theme.shape.borderRadius
                    }}
                  />
                  <Bar
                    dataKey="active"
                    name="Active Users"
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="total"
                    name="Total Users"
                    fill={theme.palette.grey[300]}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Quick Admin Actions */}
          <Grid item xs={12}>
            <Paper sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: theme.shadows[2],
            }}>
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Admin Quick Actions
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                {[
                  { icon: <People />, label: 'Manage Users', color: 'primary', path: '/admin/users' },
                  { icon: <PermissionsIcon />, label: 'Permissions', color: 'secondary', path: '/admin/permissions' },
                  { icon: <SecurityIcon />, label: 'Security Settings', color: 'error', path: '/admin/security' },
                  { icon: <LogsIcon />, label: 'View Logs', color: 'warning', path: '/admin/logs' },
                  { icon: <SettingsIcon />, label: 'System Config', color: 'info', path: '/admin/settings' },
                  { icon: <NotificationsIcon />, label: 'Send Alert', color: 'success', path: '/admin/alerts' }
                ].map((action, index) => (
                  <Grid item xs={6} sm={4} md={2} key={index}>
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
                        transition: 'all 0.3s ease',
                        border: `1px solid ${theme.palette.divider}`,
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: theme.shadows[4],
                          borderColor: theme.palette[action.color].main,
                          backgroundColor: theme.palette[action.color].light
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
                      <Typography variant="body2" textAlign="center" fontWeight="medium">
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

export default AdminDashboard;
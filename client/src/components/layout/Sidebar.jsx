import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Divider, 
  Box,
  Typography,
  useTheme
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
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ drawerWidth = 240 }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Monitoring', icon: <SecurityIcon />, path: '/monitoring' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'Timeline', icon: <TimelineIcon />, path: '/timeline' },
    { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
    { text: 'Device Management', icon: <DevicesIcon />, path: '/devices' },
    { text: 'User Management', icon: <UsersIcon />, path: '/users' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.default,
          borderRight: 'none'
        },
      }}
    >
      <Toolbar />
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="h6" color="primary">
          Security Console
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main
                }
              },
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                borderRight: `3px solid ${theme.palette.primary.main}`
              }
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                variant: 'body1',
                fontWeight: 'medium'
              }} 
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          System v2.4.1
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
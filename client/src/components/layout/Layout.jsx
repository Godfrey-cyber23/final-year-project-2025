import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { Toolbar } from '@mui/material';

const Layout = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
      <Sidebar drawerWidth={drawerWidth} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` } 
        }}
      >
        <Toolbar /> {/* This pushes content below the app bar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
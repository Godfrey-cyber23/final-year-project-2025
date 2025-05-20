import React, { useState } from 'react';
import { Badge, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDetection } from '../../hooks/useDetection';

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { notifications, clearNotifications } = useDetection();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {notifications.length === 0 ? (
          <MenuItem>
            <Typography variant="body2">No new notifications</Typography>
          </MenuItem>
        ) : (
          notifications.map((notification, index) => (
            <MenuItem key={index}>
              <Typography variant="body2">
                {notification.message} - {new Date(notification.timestamp).toLocaleTimeString()}
              </Typography>
            </MenuItem>
          ))
        )}
        <MenuItem onClick={() => {
          clearNotifications();
          handleClose();
        }}>
          Clear Notifications
        </MenuItem>
      </Menu>
    </>
  );
};

export default NotificationBell;
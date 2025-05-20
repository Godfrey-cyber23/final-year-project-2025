 
import { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useSocket } from '../../contexts/SocketContext';

const LiveFeed = () => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('disconnected');
  const [alerts, setAlerts] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    const initVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: false
        });
        videoRef.current.srcObject = stream;
        setStatus('connected');
      } catch (err) {
        setStatus('error');
      }
    };

    if (socket) {
      socket.on('detection:alert', (alert) => {
        setAlerts(prev => [...prev, alert]);
      });
      
      socket.on('connection:status', (status) => {
        setStatus(status);
      });
    }

    initVideo();

    return () => {
      if (socket) {
        socket.off('detection:alert');
        socket.off('connection:status');
      }
    };
  }, [socket]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Typography variant="h6" gutterBottom>
        Live Monitoring - Status: {status}
      </Typography>
      
      <Box sx={{ position: 'relative', border: '2px solid #ccc', borderRadius: 1 }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: '100%', height: 'auto' }}
        />
        
        {/* Alert overlay */}
        {alerts.map((alert, index) => (
          <Box key={index} sx={{
            position: 'absolute',
            top: `${alert.position.y}%`,
            left: `${alert.position.x}%`,
            bgcolor: alert.severity === 'high' ? 'error.main' : 
                   alert.severity === 'medium' ? 'warning.main' : 'success.main',
            color: 'white',
            p: 1,
            borderRadius: 1
          }}>
            {alert.type}
          </Box>
        ))}
      </Box>
      
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary">
          Capture Image
        </Button>
        <Button variant="outlined" color="secondary">
          Toggle Detection
        </Button>
      </Box>
    </Box>
  );
};

export default LiveFeed;
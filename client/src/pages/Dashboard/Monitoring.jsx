import { Container, Grid } from '@mui/material';
import LiveFeed from '../../components/detection/LiveFeed';
import DetectionLog from '../../components/detection/DetectionLog';
import SeverityStats from '../../components/detection/SeverityIndicator';

const Monitoring = () => (
  <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <LiveFeed />
      </Grid>
      <Grid item xs={12} md={4}>
        <SeverityStats />
        <DetectionLog />
      </Grid>
    </Grid>
  </Container>
);

export default Monitoring;
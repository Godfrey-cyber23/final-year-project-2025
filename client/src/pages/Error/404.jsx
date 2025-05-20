 
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <Container sx={{ textAlign: 'center', mt: 8 }}>
    <Typography variant="h1" gutterBottom>404</Typography>
    <Typography variant="h4" gutterBottom>Page Not Found</Typography>
    <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
      Return to Dashboard
    </Button>
  </Container>
);

export default NotFound;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { register } from '../../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreeTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'agreeTerms' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }
    setLoading(true);
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #000000 0%, #15803d 100%)'
    },
    formContainer: {
      width: '100%',
      maxWidth: '500px',
      padding: '40px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(10px)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    icon: {
      fontSize: 40,
      color: '#15803d',
      marginBottom: '8px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    inputGroup: {
      display: 'flex',
      gap: '16px',
      marginBottom: '20px'
    },
    input: {
      width: '100%',
      marginBottom: '20px'
    },
    checkboxLabel: {
      color: '#374151',
      fontSize: '14px'
    },
    error: {
      color: '#dc2626',
      backgroundColor: '#fee2e2',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '14px',
      marginBottom: '16px'
    },
    button: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      backgroundColor: '#15803d',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '24px'
    },
    buttonHover: {
      backgroundColor: '#166534'
    },
    link: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#15803d',
      textDecoration: 'none',
      transition: 'color 0.3s ease'
    }
  };

  return (
    <div style={styles.pageContainer}>
      <Paper style={styles.formContainer} elevation={3}>
        <Box style={styles.header}>
          <PersonAddIcon style={styles.icon} />
          <Typography style={styles.title}>Create Account</Typography>
        </Box>

        {error && (
          <Typography style={styles.error}>{error}</Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Box style={styles.inputGroup}>
            <TextField
              label="First Name"
              name="firstName"
              required
              fullWidth
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextField
              label="Last Name"
              name="lastName"
              required
              fullWidth
              value={formData.lastName}
              onChange={handleChange}
            />
          </Box>
          <TextField
            label="Email Address"
            name="email"
            type="email"
            required
            fullWidth
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            required
            fullWidth
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                color="success"
              />
            }
            label={
              <Typography style={styles.checkboxLabel}>
                I agree to the Terms and Conditions
              </Typography>
            }
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              ...styles.button,
              '&:hover': {
                backgroundColor: '#166534'
              }
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <Typography style={{ textAlign: 'center', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link href="/login" underline="hover" style={styles.link}>
            Sign in
          </Link>
        </Typography>
      </Paper>
    </div>
  );
};

export default Register;

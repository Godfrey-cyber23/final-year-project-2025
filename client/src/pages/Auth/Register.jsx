import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Alert
} from "@mui/material";
import { PersonAdd as PersonAddIcon } from "@mui/icons-material";
import { registerLecturer } from "../../services/authService";

const LecturerRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    staffId: "",
    department: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Sample departments - replace with your actual department data
  const departments = [
    { value: "computer_science", label: "Computer Science" },
    { value: "mathematics", label: "Mathematics" },
    { value: "physics", label: "Physics" },
    // Add more departments as needed
  ];

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "agreeTerms" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.agreeTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await registerLecturer({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        staffId: formData.staffId,
        department: formData.department,
        password: formData.password
      });
      
      navigate("/lecturer/login", { 
        state: { 
          registrationSuccess: true,
          email: formData.email 
        } 
      });
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={3}>
          <PersonAddIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Lecturer Registration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Register for access to the Exam Security System
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box style={styles.inputGroup}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </Box>

          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Staff ID"
              name="staffId"
              required
              value={formData.staffId}
              onChange={handleChange}
            />
          </Box>

          <TextField
            select
            fullWidth
            label="Department"
            name="department"
            required
            value={formData.department}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            {departments.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </Box>

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
            size="large"
            disabled={loading}
            sx={{
              ...styles.button,
              '&:hover': {
                backgroundColor: '#166534'
              }
            }}
          >
            {loading ? "Registering..." : "Register as Lecturer"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default LecturerRegister;
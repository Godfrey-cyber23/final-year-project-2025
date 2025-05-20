export const loginStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  },
  header: {
    textAlign: 'center',
    mb: 3,
    '& img': {
      height: '80px',
      marginBottom: '16px'
    },
    '& h5': {
      fontWeight: '700',
      color: '#2c3e50',
      marginBottom: '0.5rem'
    },
    '& .MuiTypography-body2': {
      color: '#7f8c8d',
      fontSize: '0.875rem'
    }
  },
  alert: {
    mb: 2,
    borderRadius: '8px'
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '& fieldset': {
        borderColor: '#dfe6e9'
      },
      '&:hover fieldset': {
        borderColor: '#b2bec3'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3498db',
        borderWidth: '1px'
      }
    },
    '& .MuiInputLabel-root': {
      color: '#7f8c8d',
      '&.Mui-focused': {
        color: '#3498db'
      }
    }
  },
  adminTextField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '& fieldset': {
        borderColor: '#dfe6e9'
      },
      '&:hover fieldset': {
        borderColor: '#b2bec3'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3498db',
        borderWidth: '1px'
      }
    }
  },
  adminToggle: {
    textAlign: 'right',
    mt: 1,
    '& .MuiButton-root': {
      textTransform: 'none',
      fontSize: '0.8rem',
      color: '#7f8c8d',
      '&:hover': {
        color: '#3498db',
        backgroundColor: 'transparent'
      }
    }
  },
  submitButton: {
    mt: 3,
    mb: 2,
    backgroundColor: '#3498db',
    color: 'white',
    fontWeight: '600',
    padding: '12px 0',
    borderRadius: '8px',
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#2980b9'
    },
    '&:disabled': {
      backgroundColor: '#bdc3c7'
    }
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'space-between',
    mt: 2,
    '& .MuiTypography-root': {
      '& a': {
        color: '#3498db',
        textDecoration: 'none',
        fontWeight: '500',
        fontSize: '0.8rem',
        '&:hover': {
          textDecoration: 'underline'
        }
      }
    }
  },
  formContainer: {
    width: '100%',
    maxWidth: '450px',
    padding: '2rem'
  }
};
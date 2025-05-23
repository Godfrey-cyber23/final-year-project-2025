export const forgotStyles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, #000000 0%, #15803d 100%)'
    },
    formContainer: {
        width: '100%',
        maxWidth: '450px',
        padding: '40px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)'
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
    "& .MuiTypographyBody2": {
      color: '#7f8c8d',
      fontSize: '0.875rem'
    }
  },

    iconCircle: {
    display: 'inline-block',
    backgroundColor: '#e0f2f1',
    padding: '12px',
    borderRadius: '50%',
    fontSize: '24px',
    marginBottom: '12px',
    color: '#15803d'
  },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '8px'
    },
    subtitle: {
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '24px'
    },
    inputGroup: {
        marginBottom: '20px',
        width: '100%'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151'
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        fontSize: '16px',
        border: '2px solid #1f2937',
        borderRadius: '8px',
        backgroundColor: '#f8fafc',
        transition: 'all 0.3s ease',
        outline: 'none'
    },
    button: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        fontWeight: '600',
        color: 'white',
        backgroundColor: '#15803d',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginTop: '12px'
    },
    alertError: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px'
    },
    alertSuccess: {
        backgroundColor: '#d1fae5',
        color: '#065f46',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px'
    },
    link: {
        color: '#15803d',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'color 0.3s ease'
    },
    footer: {
        textAlign: 'center',
        marginTop: '24px'
    }
}

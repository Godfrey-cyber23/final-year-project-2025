import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { forgotPassword } from '../../services/authService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const styles = {
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
            marginBottom: '32px'
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
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <div style={styles.header}>
                    <div style={styles.iconCircle}>
                        <i className="fas fa-envelope"></i>
                    </div>
                    <h1 style={styles.title}>Forgot Password</h1>
                    <p style={styles.subtitle}>Enter your email to receive a reset link</p>
                </div>

                {success ? (
                    <>
                        <div style={styles.alertSuccess}>
                            We've sent a password reset link to your email address.
                        </div>
                        <button
                            style={styles.button}
                            onClick={() => navigate('/login')}
                        >
                            Back to Login
                        </button>
                    </>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label} htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={styles.input}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {error && (
                            <div style={styles.alertError}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{
                                ...styles.button,
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <span><i className="fas fa-spinner fa-spin mr-2"></i> Sending...</span>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>

                        <div style={styles.footer}>
                            <RouterLink to="/login" style={styles.link}>
                                Remember your password? Sign in
                            </RouterLink>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;

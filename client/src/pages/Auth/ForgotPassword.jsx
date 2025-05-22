import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { forgotPassword } from '../../services/authService';
import { forgotStyles } from '../../styles/forgotStyles';
import { Box } from '@mui/material';

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


    return (
        <div style={forgotStyles.container}>
            <div style={forgotStyles.formContainer}>
                <div style={forgotStyles.header}>
                    <div style={forgotStyles.iconCircle}>
                        <i className="fas fa-envelope"></i>
                    </div>
                    <Box sx={forgotStyles.header}>
                     <img src='public/assets/images/unzaLogo.png'></img>
                     
                    <h1 style={forgotStyles.title}>Forgot Password</h1>
                    <p style={forgotStyles.subtitle}>Enter your email to receive a reset link</p>
                    </Box>
                </div>

                {success ? (
                    <>
                        <div style={forgotStyles.alertSuccess}>
                            We've sent a password reset link to your email address.
                        </div>
                        <button
                            style={forgotStyles.button}
                            onClick={() => navigate('/login')}
                        >
                            Back to Login
                        </button>
                    </>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={forgotStyles.inputGroup}>
                            <label style={forgotStyles.label} htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={forgotStyles.input}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {error && (
                            <div style={forgotStyles.alertError}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{
                                ...forgotStyles.button,
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

                        <div style={forgotStyles.footer}>
                            <RouterLink to="/login" style={forgotStyles.link}>
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

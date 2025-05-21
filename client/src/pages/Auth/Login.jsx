import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminKey, setAdminKey] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [formError, setFormError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

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
        logo: {
            height: '80px',
            marginBottom: '16px',
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
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
        alert: {
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
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
        passwordContainer: {
            position: 'relative',
            width: '100%'
        },
        passwordToggle: {
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#4b5563'
        },
        adminToggle: {
            textAlign: 'right',
            marginBottom: '20px'
        },
        toggleButton: {
            background: 'none',
            border: 'none',
            color: '#15803d',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline'
        },
        submitButton: {
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
            marginBottom: '24px'
        },
        footerLinks: {
            textAlign: 'center',
            marginTop: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        },
        link: {
            color: '#15803d',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'color 0.3s ease'
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!email || !password) {
            setFormError("Please fill in all fields");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setFormError("Please enter a valid email address");
            return;
        }

        if (isAdmin && !adminKey) {
            setFormError("Please enter admin secret key");
            return;
        }

        setIsSubmitting(true);
        const { success, error } = await login(
            email,
            password,
            isAdmin ? adminKey : null
        );
        setIsSubmitting(false);

        if (success) {
            navigate(location.state?.from || "/dashboard", { replace: true });
        } else {
            setFormError(error || "Login failed. Please try again.");
        }
    };

    return (
        <div style={styles.container} data-name="login-container">
            <div style={styles.formContainer} data-name="form-wrapper">
                <div style={styles.header} data-name="header">
                    <img
                        src="/assets/images/unzaLogo.png"
                        alt="University Logo"
                        style={styles.logo}
                        data-name="unza-logo"
                    />
                    <h1 style={styles.title}>Exam Security System</h1>
                    <p style={styles.subtitle}>University of Zambia - Final Year Project</p>
                </div>

                {formError && (
                    <div style={styles.alert} data-name="error-alert">
                        {formError}
                    </div>
                )}

                <form onSubmit={handleSubmit} data-name="login-form">
                    <div style={styles.inputGroup}>
                        <label style={styles.label} htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            placeholder="Enter your email"
                            autoComplete="email"
                            autoFocus
                            data-name="email-input"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label} htmlFor="password">Password</label>
                        <div style={styles.passwordContainer}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={styles.input}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                data-name="password-input"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.passwordToggle}
                                data-name="password-toggle"
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>

                    {isAdmin && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label} htmlFor="adminKey">Admin Secret Key</label>
                            <input
                                type="password"
                                id="adminKey"
                                value={adminKey}
                                onChange={(e) => setAdminKey(e.target.value)}
                                style={styles.input}
                                placeholder="Enter admin key"
                                data-name="admin-key-input"
                            />
                        </div>
                    )}

                    <div style={styles.adminToggle}>
                        <button
                            type="button"
                            onClick={() => setIsAdmin(!isAdmin)}
                            style={styles.toggleButton}
                            data-name="admin-toggle"
                        >
                            {isAdmin ? "Regular User Login" : "Admin Login"}
                        </button>
                    </div>

                    <button
                        type="submit"
                        style={{
                            ...styles.submitButton,
                            opacity: isSubmitting ? 0.7 : 1,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer'
                        }}
                        disabled={isSubmitting}
                        data-name="submit-button"
                    >
                        {isSubmitting ? (
                            <span><i className="fas fa-spinner fa-spin mr-2"></i>Signing In...</span>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    <div style={styles.footerLinks}>
                        <RouterLink 
                            to="/forgot-password" 
                            style={styles.link}
                            data-name="forgot-password-link"
                        >
                            Forgot password?
                        </RouterLink>
                        <RouterLink 
                            to="/register" 
                            style={styles.link}
                            data-name="register-link"
                        >
                            Don't have an account? Register
                        </RouterLink>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
import { forgotStyles } from "../../styles/forgotStyles";
import { Box } from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // Separate state for success messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await forgotPassword(email);

      if (response.success) {
        setSuccess(true);
        setMessage(response.message || "If your email exists in our system, you'll receive a reset link shortly.");
      } else {
        setError(response.error || "Failed to send reset link");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setLoading(true);
    await handleSubmit({ preventDefault: () => {} }); // Reuse submit logic
  };

  return (
    <div style={forgotStyles.container}>
      <div style={forgotStyles.formContainer}>
        <div style={forgotStyles.header}>
          <div style={forgotStyles.iconCircle}>
            <i className="fas fa-envelope"></i>
          </div>
          <Box sx={forgotStyles.header}>
            <img src="/assets/images/unzaLogo.png" alt="Unza Logo" />
            <h1 style={forgotStyles.title}>Forgot Password</h1>
            <p style={forgotStyles.subtitle}>
              Enter your email to receive a reset link
            </p>
          </Box>
        </div>

        {success ? (
          <>
            <div style={forgotStyles.alertSuccess}>
              {message || "Password reset email sent successfully!"}
            </div>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <p style={{ marginBottom: "16px", color: "#666" }}>
                Didn't receive the email?
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  style={{
                    ...forgotStyles.button,
                    backgroundColor: "#f0f0f0",
                    color: "#333",
                  }}
                  onClick={handleResend}
                  disabled={loading}
                >
                  {loading ? (
                    <span>
                      <i className="fas fa-spinner fa-spin mr-2"></i> Resending...
                    </span>
                  ) : (
                    "Resend Email"
                  )}
                </button>

                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                  <button
                    style={{
                      ...forgotStyles.button,
                      padding: "8px 16px",
                      fontSize: "0.9rem",
                    }}
                    onClick={() => navigate("/login")}
                  >
                    Back to Login
                  </button>

                  <button
                    style={{
                      ...forgotStyles.button,
                      padding: "8px 16px",
                      fontSize: "0.9rem",
                      backgroundColor: "#f0f0f0",
                      color: "#333",
                    }}
                    onClick={() => navigate("/contact-support")}
                  >
                    Contact Support
                  </button>
                </div>
              </div>

              <div style={{ marginTop: "20px", fontSize: "0.9rem", color: "#666" }}>
                <p>Check your:</p>
                <ul style={{ textAlign: "left", paddingLeft: "20px", margin: "8px 0" }}>
                  <li>Spam or junk folder</li>
                  <li>Email filters or rules</li>
                  <li>Typo in the email address</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={forgotStyles.inputGroup}>
              <label style={forgotStyles.label} htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={forgotStyles.input}
                placeholder="Enter your registered email"
                required
              />
            </div>

            {error && <div style={forgotStyles.alertError}>{error}</div>}
            {message && <div style={forgotStyles.alertSuccess}>{message}</div>}

            <button
              type="submit"
              style={{
                ...forgotStyles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
            >
              {loading ? (
                <span>
                  <i className="fas fa-spinner fa-spin mr-2"></i> Sending...
                </span>
              ) : (
                "Send Reset Link"
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
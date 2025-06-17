import nodemailer from 'nodemailer';

// Configure transporter with proper error handling
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT), // Ensure port is a number
  secure: process.env.SMTP_SECURE === 'true', // Convert string to boolean
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
  // Add connection validation
  pool: true,
  maxConnections: 1,
  maxMessages: 5
});

// Verify transporter connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send messages');
  }
});

export const sendResetEmail = async (email, token) => {
  try {
    if (!process.env.CLIENT_URL) {
      throw new Error('FRONTEND_URL environment variable is not set');
    }
    
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${encodeURIComponent(token)}`;
    
    await transporter.sendMail({
      from: `"${process.env.APP_NAME || 'Exam System'}" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Password Reset Request</h2>
          <p>You requested a password reset. Click the link below to set a new password:</p>
          
          <!-- Updated button with inline styles and table layout for maximum compatibility -->
          <table width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <table cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" bgcolor="#3498db" style="border-radius: 5px;">
                      <a href="${resetUrl}" 
                         target="_blank"
                         style="font-size: 16px; 
                                color: #ffffff; 
                                text-decoration: none; 
                                border-radius: 5px; 
                                padding: 12px 24px; 
                                border: 1px solid #3498db; 
                                display: inline-block;
                                font-weight: bold;">
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          
          <p>Or copy and paste this link into your browser:</p>
          <code style="word-break: break-all; background: #f5f5f5; padding: 5px;">${resetUrl}</code>
          
          <p style="margin-top: 20px; color: #7f8c8d; font-size: 0.9em;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
      text: `You requested a password reset. Please visit the following link to set a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.`
    });
    
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw error;
  }
};
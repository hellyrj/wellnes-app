import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (to: string, token: string) => {
  const verificationUrl = process.env.FRONTEND_URL 
    ? `${process.env.FRONTEND_URL}/verify-email?token=${token}`
    : null;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .button { 
          display: inline-block; 
          padding: 12px 24px; 
          background: #4F46E5; 
          color: white; 
          text-decoration: none; 
          border-radius: 5px;
          margin: 20px 0;
        }
        .token { 
          background: #f3f4f6; 
          padding: 15px; 
          border-radius: 5px; 
          font-family: monospace; 
          word-break: break-all;
          margin: 20px 0;
        }
        .footer { color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌿 Young Mental Wellness</h1>
        </div>
        <h2>Welcome! Please verify your email</h2>
        ${verificationUrl ? `
          <p>Click the button below to verify your email address and get started:</p>
          <a href="${verificationUrl}" class="button">Verify Email</a>
          <p>Or copy this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
        ` : `
          <p>Copy the verification token below and use it in your API request:</p>
          <div class="token">${token}</div>
          <p>Use this token with: GET /api/auth/verify-email?token=${token}</p>
        `}
        <p>This token expires in 24 hours.</p>
        <div class="footer">
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Young Mental Wellness" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Verify Your Email Address',
    html,
  });
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .button { 
          display: inline-block; 
          padding: 12px 24px; 
          background: #4F46E5; 
          color: white; 
          text-decoration: none; 
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer { color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Reset Your Password</h1>
        </div>
        <p>You requested to reset your password. Click the button below:</p>
        <a href="${resetUrl}" class="button">Reset Password</a>
        <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link expires in 1 hour.</p>
        <div class="footer">
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Young Mental Wellness" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Reset Your Password',
    html,
  });
};
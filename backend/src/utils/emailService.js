import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const emailFrom = process.env.EMAIL_FROM || 'CrowdCivic <onboarding@resend.dev>';

/**
 * Send OTP email for registration or password reset
 * @param {string} email - Recipient email
 * @param {string} otpCode - 6-digit OTP code
 * @param {string} type - 'registration' or 'forgot_password'
 */
export const sendOTP = async (email, otpCode, type) => {
  try {
    const subject = type === 'registration' 
      ? 'Verify Your Email - CrowdCivic' 
      : 'Reset Your Password - CrowdCivic';
    
    const message = type === 'registration'
      ? 'Welcome to CrowdCivic! Please verify your email with the OTP below to complete your registration.'
      : 'We received a request to reset your password. Use the OTP below to proceed. If you didn\'t request this, please ignore this email.';

    const emailContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
      .content { padding: 30px; text-align: center; }
      .otp-box { background-color: #f0f0f0; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 20px 0; }
      .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; margin: 10px 0; }
      .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }
      h1 { margin: 0; }
      p { line-height: 1.6; color: #333; }
      .warning { color: #d32f2f; font-size: 12px; margin-top: 10px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🔐 ${subject}</h1>
      </div>
      <div class="content">
        <p>${message}</p>
        <div class="otp-box">
          <p style="margin-top: 0; color: #666;">Your One-Time Password (OTP) is:</p>
          <div class="otp-code">${otpCode}</div>
          <p style="margin-bottom: 0; color: #666; font-size: 14px;">This code expires in 10 minutes</p>
        </div>
        <p style="font-size: 14px; color: #666;">
          If you did not request this, please ignore this email or contact our support team.
        </p>
      </div>
      <div class="footer">
        <p>&copy; 2024 CrowdCivic. All rights reserved.</p>
        <p>This is an automated email, please do not reply directly to this email.</p>
      </div>
    </div>
  </body>
</html>
    `.trim();

    const result = await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: subject,
      html: emailContent
    });

    console.log(`✓ OTP email sent to ${email} (Type: ${type})`, result);
    return result;
  } catch (error) {
    console.error(`✗ Failed to send OTP email to ${email}:`, error);
    throw error;
  }
};

/**
 * Send welcome email to newly registered user
 * @param {string} email - Recipient email
 * @param {string} name - User's name
 */
export const sendWelcomeEmail = async (email, name) => {
  try {
    const emailContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
      .content { padding: 30px; }
      .welcome-box { background-color: #f0f9ff; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; }
      .features { margin: 30px 0; }
      .feature-item { margin: 15px 0; }
      .feature-icon { font-size: 24px; margin-right: 10px; }
      .cta-button { display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
      .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }
      h1 { margin: 0; }
      p { line-height: 1.6; color: #333; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🎉 Welcome to CrowdCivic, ${name.split(' ')[0]}!</h1>
      </div>
      <div class="content">
        <p>Thank you for joining CrowdCivic! We're excited to have you as part of our community.</p>
        
        <div class="welcome-box">
          <p><strong>Your account is now active and ready to use.</strong></p>
          <p>Start reporting civic issues in your community right away.</p>
        </div>

        <div class="features">
          <h2>What You Can Do:</h2>
          <div class="feature-item">
            <span class="feature-icon">📍</span>
            <span><strong>Report Issues</strong> - Submit complaints about potholes, streetlights, water supply, and more</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📊</span>
            <span><strong>Track Progress</strong> - Monitor the status of your complaints in real-time</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">💬</span>
            <span><strong>Get Updates</strong> - Receive notifications when your issues are addressed</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🌍</span>
            <span><strong>Make Impact</strong> - Help improve your city by reporting civic issues</span>
          </div>
        </div>

        <p style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:3000/dashboard" class="cta-button">Go to Your Dashboard</a>
        </p>

        <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
          If you have any questions or need help, visit our <a href="http://localhost:3000/contact" style="color: #667eea;">Contact Page</a> or reach out to our support team.
        </p>
      </div>
      <div class="footer">
        <p>&copy; 2024 CrowdCivic. All rights reserved.</p>
        <p>This is an automated email, please do not reply directly to this email.</p>
      </div>
    </div>
  </body>
</html>
    `.trim();

    const result = await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: `Welcome to CrowdCivic, ${name}! 🎉`,
      html: emailContent
    });

    console.log(`✓ Welcome email sent to ${email}`, result);
    return result;
  } catch (error) {
    console.error(`✗ Failed to send welcome email to ${email}:`, error);
    throw error;
  }
};

/**
 * Send email notification when password is changed
 * @param {string} email - Recipient email
 */
export const sendPasswordChanged = async (email) => {
  try {
    const emailContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
      .content { padding: 30px; text-align: center; }
      .success-box { background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0; }
      .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }
      h1 { margin: 0; }
      p { line-height: 1.6; color: #333; }
      .icon { font-size: 40px; margin: 10px 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🔐 Password Successfully Changed</h1>
      </div>
      <div class="content">
        <div class="success-box">
          <div class="icon">✓</div>
          <p><strong>Your password has been successfully updated.</strong></p>
          <p>Your CrowdCivic account is now secured with your new password.</p>
        </div>
        
        <p style="margin-top: 30px; font-size: 14px; color: #666;">
          If you did not make this change or have concerns about your account security, please contact our support team immediately.
        </p>
        
        <p style="margin-top: 20px;">
          <a href="http://localhost:3000/dashboard" style="color: #667eea; text-decoration: none; font-weight: bold;">Return to Dashboard</a>
        </p>
      </div>
      <div class="footer">
        <p>&copy; 2024 CrowdCivic. All rights reserved.</p>
        <p>This is an automated email, please do not reply directly to this email.</p>
      </div>
    </div>
  </body>
</html>
    `.trim();

    const result = await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: 'Your Password Has Been Changed - CrowdCivic',
      html: emailContent
    });

    console.log(`✓ Password changed confirmation email sent to ${email}`, result);
    return result;
  } catch (error) {
    console.error(`✗ Failed to send password changed email to ${email}:`, error);
    throw error;
  }
};

/**
 * Send complaint status update email
 * @param {string} email - Recipient email
 * @param {string} trackingId - Complaint tracking ID
 * @param {string} status - New status (e.g., 'Submitted', 'Assigned', 'Work In Progress', 'Resolved')
 * @param {string} message - Status update message
 */
export const sendStatusUpdate = async (email, trackingId, status, message) => {
  try {
    const statusColors = {
      'Submitted': '#3b82f6',
      'Assigned': '#f59e0b',
      'Work In Progress': '#8b5cf6',
      'Resolved': '#10b981',
      'Closed': '#6b7280'
    };

    const statusColor = statusColors[status] || '#667eea';
    const statusEmoji = {
      'Submitted': '📋',
      'Assigned': '👷',
      'Work In Progress': '🔧',
      'Resolved': '✓',
      'Closed': '✓'
    }[status] || '📊';

    const emailContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
      .content { padding: 30px; }
      .status-box { border-left: 4px solid ${statusColor}; background-color: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 4px; }
      .status-badge { display: inline-block; background-color: ${statusColor}; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
      .tracking-id { background-color: #f0f0f0; padding: 15px; border-radius: 4px; margin: 15px 0; word-break: break-all; }
      .tracking-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
      .tracking-code { font-size: 20px; font-weight: bold; color: #667eea; font-family: monospace; }
      .cta-button { display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
      .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }
      p { line-height: 1.6; color: #333; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${statusEmoji} Complaint Status Update</h1>
      </div>
      <div class="content">
        <p>Hello,</p>
        
        <p>There's an update on your complaint:</p>

        <div class="status-box">
          <div class="status-badge">${status}</div>
          <p style="margin-top: 15px; margin-bottom: 0;">${message}</p>
        </div>

        <div class="tracking-id">
          <p class="tracking-label">Tracking ID:</p>
          <p class="tracking-code">${trackingId}</p>
        </div>

        <p style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:3000/my-complaints" class="cta-button">View Full Details</a>
        </p>

        <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
          Thank you for helping improve our city. You can track the progress of this complaint at any time from your dashboard.
        </p>
      </div>
      <div class="footer">
        <p>&copy; 2024 CrowdCivic. All rights reserved.</p>
        <p>This is an automated email, please do not reply directly to this email.</p>
      </div>
    </div>
  </body>
</html>
    `.trim();

    const result = await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: `Complaint Update: ${status} - Tracking ID: ${trackingId}`,
      html: emailContent
    });

    console.log(`✓ Status update email sent to ${email} for complaint ${trackingId}`, result);
    return result;
  } catch (error) {
    console.error(`✗ Failed to send status update email to ${email}:`, error);
    throw error;
  }
};

/**
 * Generic email function for additional use cases
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 */
export const sendEmail = async (to, subject, html) => {
  try {
    const result = await resend.emails.send({
      from: emailFrom,
      to: to,
      subject: subject,
      html: html
    });

    console.log(`✓ Email sent to ${to}`, result);
    return result;
  } catch (error) {
    console.error(`✗ Failed to send email to ${to}:`, error);
    throw error;
  }
};

// Verify email service is working
export const verifyEmailService = async () => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured in .env');
    }
    if (!process.env.EMAIL_FROM) {
      throw new Error('EMAIL_FROM is not configured in .env');
    }
    console.log('✓ Email service verified successfully');
    console.log(`  - Using API Key: ${process.env.RESEND_API_KEY.substring(0, 10)}...`);
    console.log(`  - Email From: ${emailFrom}`);
    return true;
  } catch (error) {
    console.error('✗ Email service verification failed:', error.message);
    throw error;
  }
};

export default {
  sendOTP,
  sendWelcomeEmail,
  sendPasswordChanged,
  sendStatusUpdate,
  sendEmail,
  verifyEmailService
};

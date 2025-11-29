import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Enhanced transporter with better error handling and production settings
const createTransporter = () => {
  try {
    console.log('🔧 Creating email transporter...');
    console.log('Email Service:', process.env.EMAIL_SERVICE);
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Client URL:', process.env.CLIENT_URL);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    // Check if required environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('❌ Email credentials are missing in environment variables');
    }

    if (process.env.EMAIL_PASS.length !== 16) {
      console.warn('⚠️  Warning: EMAIL_PASS should be a 16-character Gmail App Password, not your regular Gmail password');
    }

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Additional settings for better production reliability
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
      rateLimit: 10,
      // Timeout settings
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    });

    return transporter;
  } catch (error) {
    console.error('❌ Error creating email transporter:', error);
    throw error;
  }
};

const transport = createTransporter();

// Verify transporter on startup
transport.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter verification FAILED:', error);
    console.error('💡 Solution: Check if you are using Gmail App Password (16 characters)');
    console.error('💡 Go to: Google Account → Security → App Passwords');
  } else {
    console.log('✅ Email transporter is ready to send messages');
  }
});

export const sendEmail = async (to, subject, html) => {
  try {
    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`📨 Using sender: ${process.env.EMAIL_USER}`);
    console.log(`🌐 Client URL: ${process.env.CLIENT_URL}`);
    
    const mailOptions = {
      from: `Employee Management System <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      // Add text version for email clients that don't support HTML
      text: subject + ' - Please view this email in an HTML-compatible email client.',
    };

    const result = await transport.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', to);
    console.log('📫 Message ID:', result.messageId);
    console.log('✅ Response:', result.response);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    
    // More detailed error logging
    console.error('🔍 Error details:');
    console.error('Error code:', error.code);
    console.error('Error command:', error.command);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    
    // Specific error handling for common issues
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication failed! Please check:');
      console.error('1. Gmail 2-factor authentication is ENABLED');
      console.error('2. You are using APP PASSWORD (16 characters), not regular password');
      console.error('3. App password is generated for "Mail"');
    }
    
    if (error.code === 'EENVELOPE') {
      console.error('📮 Envelope error - check recipient email address');
    }
    
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

export const emailTemplates = {
  welcomeEmployee: (employee, password) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0;
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white; 
          padding: 40px 20px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-size: 28px;
          font-weight: 700;
        }
        .content { 
          padding: 40px; 
          background: #f8fafc;
        }
        .welcome-section {
          background: white;
          padding: 30px;
          border-radius: 10px;
          margin-bottom: 20px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .credentials {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .button { 
          display: inline-block; 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white; 
          padding: 14px 28px; 
          text-decoration: none; 
          border-radius: 8px; 
          font-weight: 600;
          margin: 20px 0;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
          transition: all 0.3s ease;
        }
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }
        .footer { 
          text-align: center; 
          padding: 30px; 
          font-size: 12px; 
          color: #6b7280;
          background: #1f2937;
          color: #9ca3af;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 20px 0;
        }
        .info-item {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #2563eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Employee Management System</h1>
          <p>Your account has been created successfully!</p>
        </div>
        <div class="content">
          <div class="welcome-section">
            <h2 style="color: #1f2937; margin-top: 0;">Hello ${employee.firstName} ${employee.lastName},</h2>
            <p style="color: #6b7280; font-size: 16px;">
              We're excited to have you on board! Your account has been set up and you can now access the Employee Management System.
            </p>
            
            <div class="credentials">
              <h3 style="color: #d97706; margin-top: 0;">Your Login Credentials:</h3>
              <div class="info-grid">
                <div class="info-item">
                  <strong>Email:</strong><br>
                  ${employee.email}
                </div>
                <div class="info-item">
                  <strong>Password:</strong><br>
                  ${password}
                </div>
              </div>
              <p style="color: #92400e; font-size: 14px; margin: 10px 0 0 0;">
                🔒 For security reasons, please change your password after first login.
              </p>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL || 'https://employeeesmanage.vercel.app'}/login" class="button">
                🚀 Login to Your Account
              </a>
            </div>

            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <h4 style="color: #1e40af; margin: 0 0 10px 0;">📋 What you can do:</h4>
              <ul style="color: #374151; margin: 0; padding-left: 20px;">
                <li>Mark your daily attendance</li>
                <li>View your attendance history</li>
                <li>Update your personal profile</li>
                <li>Access company resources</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer">
          <p>&copy; 2024 Employee Management System. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  attendanceUpdate: (adminEmail, employee, changes, reason) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background: #f8fafc;
          margin: 0;
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white; 
          padding: 30px 20px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-size: 24px;
          font-weight: 600;
        }
        .content { 
          padding: 30px; 
        }
        .alert-section {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .changes-section {
          background: #fffbeb;
          border: 1px solid #fed7aa;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .footer { 
          text-align: center; 
          padding: 20px; 
          font-size: 12px; 
          color: #6b7280;
          background: #1f2937;
          color: #9ca3af;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Attendance Update Notification</h1>
        </div>
        <div class="content">
          <div class="alert-section">
            <h2 style="color: #dc2626; margin-top: 0;">Attention Required</h2>
            <p style="color: #7f1d1d;">
              Attendance record for <strong>${employee.firstName} ${employee.lastName}</strong> has been modified.
            </p>
          </div>

          <div class="changes-section">
            <h3 style="color: #92400e;">Changes Made:</h3>
            <pre style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #e5e7eb; overflow-x: auto;">${JSON.stringify(changes, null, 2)}</pre>
            
            <h3 style="color: #92400e; margin-top: 20px;">Reason for Change:</h3>
            <p style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #e5e7eb;">
              ${reason}
            </p>
          </div>

          <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="color: #1e40af; margin: 0;">
              🔍 Please review this change in the system to ensure accuracy.
            </p>
          </div>
        </div>
        <div class="footer">
          <p>&copy; 2024 Employee Management System. All rights reserved.</p>
          <p>This is an automated notification from the attendance system.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  passwordReset: (user, resetUrl) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        line-height: 1.6; 
        color: #333; 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        margin: 0;
        padding: 20px;
      }
      .container { 
        max-width: 600px; 
        margin: 0 auto; 
        background: white; 
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      }
      .header { 
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        color: white; 
        padding: 40px 20px; 
        text-align: center; 
      }
      .content { 
        padding: 40px; 
        background: #f8fafc;
      }
      .button { 
        display: inline-block; 
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        color: white; 
        padding: 14px 28px; 
        text-decoration: none; 
        border-radius: 8px; 
        font-weight: 600;
        margin: 20px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🔐 Password Reset Request</h1>
        <p>You requested to reset your password</p>
      </div>
      <div class="content">
        <div style="background: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hello ${user.firstName} ${user.lastName},</h2>
          <p style="color: #6b7280; font-size: 16px;">
            We received a request to reset your password for the Employee Management System.
            Click the button below to create a new password:
          </p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">
              Reset Your Password
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            This link will expire in 1 hour for security reasons.<br>
            If the button doesn't work, copy and paste this link in your browser:<br>
            <code style="background: #f3f4f6; padding: 8px; border-radius: 4px; word-break: break-all;">${resetUrl}</code>
          </p>
          
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="color: #dc2626; margin: 0; font-size: 14px;">
              ⚠️ If you didn't request this reset, please ignore this email and your password will remain unchanged.
            </p>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `
};
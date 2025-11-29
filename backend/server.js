import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Route imports
import authRoutes from './routes/auth.js';
import attendanceRoutes from './routes/attendance.js';
import userRoutes from './routes/users.js';
import plantRoutes from './routes/plants.js';

// Import the email service
import { sendEmail } from './services/emailService.js'; // Adjust path as needed

dotenv.config();
connectDB();

const app = express();

// --- SECURITY MIDDLEWARE ---
app.use(helmet());

// --- FIX FOR CORS (MOST IMPORTANT PART) ---
const allowedOrigins = [
  "https://employeeesmanage.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight OPTIONS before anything else
app.options("*", cors());

// --- RATE LIMITER ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// --- BODY PARSER ---
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

// --- API ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/plants", plantRoutes);

// --- HEALTH CHECK ---
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server running",
    environment: process.env.NODE_ENV,
    time: new Date().toISOString()
  });
});

// --- DEBUG EMAIL ROUTE (ADD THIS) ---
app.get("/api/debug-email", async (req, res) => {
  try {
    console.log('🔧 Testing email functionality...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Client URL:', process.env.CLIENT_URL);
    
    await sendEmail(
      'tusharsharmaprayagraj@gmail.com', 
      'Test Email from Production - Employee Management System',
      `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #2563eb;">✅ Test Email Successful!</h1>
        <p>If you're reading this, your email service is working perfectly in <strong>${process.env.NODE_ENV}</strong> environment!</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3>Email Configuration:</h3>
          <ul>
            <li><strong>Service:</strong> ${process.env.EMAIL_SERVICE}</li>
            <li><strong>From:</strong> ${process.env.EMAIL_USER}</li>
            <li><strong>Client URL:</strong> ${process.env.CLIENT_URL}</li>
            <li><strong>Environment:</strong> ${process.env.NODE_ENV}</li>
          </ul>
        </div>
        <p>Your password reset functionality should now work correctly! 🎉</p>
      </div>
      `
    );
    
    res.json({ 
      success: true, 
      message: 'Test email sent successfully to tusharsharmaprayagraj@gmail.com',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Email test failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: 'Check Render logs for detailed error information',
      environment: process.env.NODE_ENV
    });
  }
});

// --- FIXED: REMOVE FRONTEND CATCH-ALL COMPLETELY ---

// ❌ REMOVE THIS from your server:
// app.get("*", ...)

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error(err);

  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
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

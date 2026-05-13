const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// ✅ CORS first, before everything
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://ai-based-resume-analyzer-psi.vercel.app', // your Vercel URL
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { twitterRouter } from './routes/twitter.js';
import { tasksRouter } from './routes/tasks.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Main endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Hello, Backend is working!",
    status: "online",
    version: "1.0.0"
  });
});

// Login endpoint
app.get("/login", (req, res) => {
  res.json({
    message: "Login Endpoint!",
    auth_url: "/api/twitter/auth/url"
  });
});

// API Routes
app.use('/api/twitter', twitterRouter);
app.use('/api/tasks', tasksRouter);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
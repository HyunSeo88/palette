require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
// This will make files in server/public accessible, e.g., /uploads/posts/image.jpg
app.use(express.static('server/public'));

// Base route for API health check
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Palette API' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/post.routes.js'));
// app.use('/api/comments', require('./routes/comments')); // 기존 댓글 라우트 주석 처리 또는 삭제

// 새로운 댓글 라우트 등록 (/api/posts/:postId/comments)
// comment.routes.js에서 mergeParams: true를 사용했으므로, 여기서 :postId를 받을 수 있습니다.
const commentRoutes = require('./routes/comment.routes.js');
app.use('/api/posts/:postId/comments', commentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err); // Log the full error for debugging

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong on the server.';
  let details = null; // For additional error details, like validation errors

  // Mongoose Validation Error (from user.controller or direct model save/update)
  if (err.name === 'ValidationError') {
    statusCode = err.statusCode || 400; // err.statusCode might be set by our createError helper
    message = err.message || 'Validation failed. Please check your input.';
    // Extract validation error details for a more informative response
    if (err.errors) {
      details = {};
      for (const key in err.errors) {
        details[key] = err.errors[key].message;
      }
    }
  }

  // Mongoose CastError (e.g., invalid ObjectId format)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID format for field: ${err.path}. Expected a valid ObjectId.`;
    details = { field: err.path, value: err.value, reason: 'Invalid ObjectId' };
  }
  
  // Multer errors (e.g., file too large, invalid file type)
  // Multer errors have a `code` property
  if (err.code && typeof err.code === 'string' && err.code.startsWith('LIMIT_')) {
    statusCode = 400;
    message = 'File upload error: ' + err.message; // Multer provides a decent message
    if (err.field) {
        details = { field: err.field, reason: err.code };
    }
  } else if (err.message && err.message.startsWith('Invalid file type')) { // Custom error from our fileFilter
    statusCode = 400;
    message = err.message;
  }
  
  // JWT errors (e.g., TokenExpiredError, JsonWebTokenError from auth.middleware.js)
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired. Please log in again.';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  const errorResponse = {
    success: false,
    message: message,
  };

  if (details) {
    errorResponse.details = details;
  }
  
  // In development, you might want to send the full error stack
  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
      errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
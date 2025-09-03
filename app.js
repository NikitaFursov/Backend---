import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import { swaggerDocs } from './config/swagger.js';
import connectDB from './config/db.js';
import './config/passport.js';
import apiRoutes from './routes/index.js';
import errorHandler from './middleware/error_middleware.js';

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});
app.use(limiter);

//Doc Swagger
await swaggerDocs(app);

// Routes
app.use('/api', apiRoutes);

// Error handling
app.use(errorHandler.notFound);
app.use(errorHandler.globalErrorHandler);

// Server start
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
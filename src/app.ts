import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: config.corsOrigin || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({status: 'ok', timestamp: new Date().toISOString()});
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({message: 'Route not found'});
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({message: 'Internal server error'});
});

export default app;

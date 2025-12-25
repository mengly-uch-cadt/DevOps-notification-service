import { Router, Request, Response } from 'express';
import { sendSuccess } from '../utils/response';
import authRoutes from './auth.routes';

const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  sendSuccess(
    res,
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    'Service is healthy'
  );
});

// Public settings routes

// Auth routes
router.use('/auth', authRoutes);

export default router;

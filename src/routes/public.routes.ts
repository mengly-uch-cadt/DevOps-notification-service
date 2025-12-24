import { Router, Request, Response } from 'express';
import { publicTaskRoutes } from './task.routes';
import { sendSuccess } from '../utils/response';

const router = Router();

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
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

// Public task routes
router.use('/tasks', publicTaskRoutes);

export default router;

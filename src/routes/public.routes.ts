import { Router, Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

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


export default router;

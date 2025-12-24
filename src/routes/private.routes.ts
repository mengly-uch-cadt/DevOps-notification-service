import { Router } from 'express';
import { privateTaskRoutes } from './task.routes';
import { authenticateServiceToken } from '../middlewares/auth.serviceToken';

const router = Router();

// Apply service token authentication to all private routes
router.use(authenticateServiceToken);

// Private task routes
router.use('/tasks', privateTaskRoutes);

export default router;

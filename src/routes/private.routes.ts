import { Router } from 'express';
import settingsRoutes from './settings.routes';
import { authenticateServiceToken } from '../middlewares/auth.serviceToken';

const router = Router();

// Apply service token authentication to all private routes
router.use(authenticateServiceToken);

// Private settings routes
router.use('/settings', settingsRoutes);

export default router;

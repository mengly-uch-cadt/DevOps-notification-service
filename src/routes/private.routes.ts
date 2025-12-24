import { Router } from 'express';
import settingsRoutes from './settings.routes';
import { authenticateJWT } from '../middlewares/auth.jwt';

const router = Router();

// Apply JWT authentication to all private routes
router.use(authenticateJWT);

// Private settings routes
router.use('/settings', settingsRoutes);

export default router;

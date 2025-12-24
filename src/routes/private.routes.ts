import { Router } from 'express';
import settingsRoutes from './settings.routes';
import authRoutes from './auth.routes';
import { authenticateJWT } from '../middlewares/auth.jwt';

const router = Router();

// Auth routes (no JWT middleware - handles own auth via Bearer token)
router.use('/auth', authRoutes);

// Apply JWT authentication to all other private routes
router.use(authenticateJWT);

// Private settings routes
router.use('/settings', settingsRoutes);

export default router;

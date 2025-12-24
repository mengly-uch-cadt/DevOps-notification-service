import { Router } from 'express';
import settingsRoutes from './settings.routes';
import authRoutes from './auth.routes';
import accessesRoutes from './accesses.routes';
import adminsRoutes from './admins.routes';
import notificationsRoutes from './notifications.routes';
import usersRoutes from './users.routes';
import { authenticateJWT } from '../middlewares/auth.jwt';

const router = Router();

// Auth routes (no JWT middleware - handles own auth via Bearer token)
router.use('/auth', authRoutes);

// Apply JWT authentication to all other private routes
router.use(authenticateJWT);

// CRUD routes
router.use('/accesses', accessesRoutes);
router.use('/admins', adminsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/users', usersRoutes);
router.use('/settings', settingsRoutes);

export default router;

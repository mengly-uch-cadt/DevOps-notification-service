import { Router } from 'express';
import publicRoutes from './public.routes';
import privateRoutes from './private.routes';
import sysRoutes from './sys.routes';

const router = Router();

// Mount public, private, and system route groups
router.use('/public', publicRoutes);
router.use('/private', privateRoutes);
router.use('/sys', sysRoutes);

export default router;

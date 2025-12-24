import { Router } from 'express';
import publicRoutes from './public.routes';
import privateRoutes from './private.routes';

const router = Router();

// Mount public and private route groups
router.use('/public', publicRoutes);
router.use('/private', privateRoutes);

export default router;

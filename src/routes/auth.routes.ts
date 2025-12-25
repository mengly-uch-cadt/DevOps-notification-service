import { Router } from 'express';
import { ssoLogin } from '../controllers/auth.controller';

const router = Router();

// SSO Login endpoint
router.post('/sso/login', ssoLogin);

export default router;

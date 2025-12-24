import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { ssoLoginRequest } from '../requests/auth.request';

const router = Router();

router.post('/sso-login', validate(ssoLoginRequest), authController.ssoLogin);

export default router;

import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';

export class AuthController {
  async ssoLogin(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization?.trim();

      if (!authHeader) {
        sendError(res, 'Authorization header is required', 401);
        return;
      }

      const parts = authHeader.split(/\s+/);

      if (parts.length !== 2 || parts[0].toLowerCase() !== 'basic') {
        sendError(res, 'Invalid authorization format. Use: Basic <credentials>', 401);
        return;
      }

      // Decode Basic Auth credentials
      const credentials = Buffer.from(parts[1], 'base64').toString('utf-8');
      const [origin, token] = credentials.split(':');

      if (!origin || !token) {
        sendError(res, 'Invalid Basic Auth credentials format', 401);
        return;
      }

      // Get user_id and hash from request body
      const { user_id, hash } = req.body;

      if (!user_id || !hash) {
        sendError(res, 'user_id and hash are required in request body', 400);
        return;
      }

      // Validate origin and token against database settings
      const [originSetting, tokenSetting] = await Promise.all([
        authService.getSetting('single_id_sys_origin'),
        authService.getSetting('single_id_sys_token'),
      ]);

      if (!originSetting || !tokenSetting) {
        sendError(res, 'Single ID system settings not configured', 500);
        return;
      }

      if (origin !== originSetting.value || token !== tokenSetting.value) {
        sendError(res, 'Invalid credentials', 401);
        return;
      }

      // Validate user with Single ID system
      const result = await authService.validateUserAndGenerateJWT(user_id, hash);

      if (!result) {
        sendError(res, 'Invalid user or authentication failed', 401);
        return;
      }

      sendSuccess(
        res,
        {
          token: result.token,
          user: result.user,
        },
        'Login successful',
        200
      );
    } catch (error) {
      console.error('Auth error:', error);
      sendError(res, 'An error occurred during authentication', 500);
    }
  }
}

export const authController = new AuthController();

import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';

export class AuthController {
  async ssoLogin(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;

      const result = await authService.validateExternalTokenAndGenerateJWT(token);

      if (!result) {
        sendError(res, 'Invalid token or user not found', 401);
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
      sendError(res, 'An error occurred during authentication', 500);
    }
  }
}

export const authController = new AuthController();

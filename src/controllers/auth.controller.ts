import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';

export const ssoLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user_id, hash } = req.body;

    if (!user_id || !hash) {
      res.status(400).json({
        status: 'error',
        message: 'user_id and hash are required',
        data: null
      });
      return;
    }

    const result = await authService.ssoLogin({ user_id, hash });
    sendSuccess(res, result, 'SSO login successful');
  } catch (error) {
    next(error);
  }
};

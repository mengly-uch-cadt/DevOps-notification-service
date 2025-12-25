import jwt from 'jsonwebtoken';
import { baseService } from './base.service';
import { AppError } from '../middlewares/errorHandler';

const M = baseService.prisma.settings;

interface SingleIdTokenPayload {
  user_id?: string;
  id?: string;
  [key: string]: any;
}

interface SSOLoginPayload {
  user_id: string;
  hash: string;
}

interface SingleIdResponse {
  status: string;
  message: string | null;
  data: {
    token: string;
    user: any;
  } | null;
}

export interface JWTPayload {
  user_id: string;
  [key: string]: any;
}

export class AuthService {

  async ssoLogin(payload: SSOLoginPayload): Promise<{ token: string; user: any }> {
    try {
      // Get single_id_sys_url, single_id_sys_origin and single_id_sys_token from settings
      const sysUrl = await baseService.findOne(M, {
        slug_key: {
          slug: 'single_id_sys_url',
          key: 'single_id_sys_url'
        }
      });

      const sysOrigin = await baseService.findOne(M, {
        slug_key: {
          slug: 'single_id_sys_origin',
          key: 'single_id_sys_origin'
        }
      });

      const sysToken = await baseService.findOne(M, {
        slug_key: {
          slug: 'single_id_sys_token',
          key: 'single_id_sys_token'
        }
      });

      if (!sysUrl || !sysOrigin || !sysToken) {
        throw new AppError('SSO configuration not found in settings', 500);
      }

      const singleIdUrl = (sysUrl as any).value;
      const singleIdOrigin = (sysOrigin as any).value;
      const singleIdToken = (sysToken as any).value;

      // Make POST request to single_id system with Basic Auth
      // Username: single_id_sys_origin value, Password: single_id_sys_token value
      const response = await fetch(singleIdUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${singleIdOrigin}:${singleIdToken}`).toString('base64')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: payload.user_id,
          hash: payload.hash
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new AppError(`SSO authentication failed: ${errorText}`, 401);
      }

      const responseData = await response.json() as SingleIdResponse;

      // Decode the token from single_id system
      const receivedToken = responseData.data?.token;
      if (!receivedToken) {
        throw new AppError('No token received from SSO system', 401);
      }

      // Decode the token (without verification since it's from trusted source)
      const decoded = jwt.decode(receivedToken) as SingleIdTokenPayload;

      if (!decoded) {
        throw new AppError('Invalid token from SSO system', 401);
      }

      // Generate new JWT token for notification system
      const jwtSecret = process.env.JWT_SECRET || 'your-jwt-secret';

      // Remove exp, iat, nbf from decoded token to avoid conflicts
      const { exp, iat, nbf, ...tokenPayload } = decoded;

      const newToken = jwt.sign(
        {
          user_id: decoded.user_id || decoded.id,
          ...tokenPayload
        },
        jwtSecret,
        { expiresIn: '24h' }
      );

      return {
        token: newToken,
        user: decoded
      };

    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`SSO authentication error: ${error.message}`, 500);
    }
  }

  verifyToken(token: string): JWTPayload | null {
    try {
      const jwtSecret = process.env.JWT_SECRET || 'your-jwt-secret';
      const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();

import jwt from 'jsonwebtoken';
import { BaseService } from './base.service';

export interface DecodedExternalToken {
  user_id: string;
  hash: string;
  [key: string]: any;
}

export interface JWTPayload {
  user_id: string;
  hash: string;
  name: string;
}

export class AuthService extends BaseService {
  async validateExternalTokenAndGenerateJWT(
    externalToken: string
  ): Promise<{ token: string; user: any } | null> {
    try {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        throw new Error('JWT_SECRET not configured');
      }

      // Decode external token (without verification as it's from another system)
      const decoded = jwt.decode(externalToken) as DecodedExternalToken | null;

      if (!decoded || !decoded.user_id || !decoded.hash) {
        return null;
      }

      // Find user by user_id and hash
      const user = await this.prisma.users.findFirst({
        where: {
          user_id: decoded.user_id,
          hash: decoded.hash,
        },
      });

      if (!user) {
        return null;
      }

      // Get JWT TTL from settings
      const jwtTtlSetting = await this.prisma.settings.findFirst({
        where: {
          slug: 'jwt_ttl',
          key: 'jwt_ttl',
        },
      });

      const ttlMinutes = jwtTtlSetting ? parseInt(jwtTtlSetting.value) : 1440; // Default 24 hours

      // Generate new JWT token with same user_id and hash from external token
      const payload: JWTPayload = {
        user_id: decoded.user_id,
        hash: decoded.hash,
        name: user.name,
      };

      const token = jwt.sign(payload, jwtSecret, {
        expiresIn: `${ttlMinutes}m`,
      });

      return {
        token,
        user: {
          user_id: decoded.user_id,
          name: user.name,
        },
      };
    } catch (error) {
      console.error('Error validating external token:', error);
      return null;
    }
  }

  verifyToken(token: string): JWTPayload | null {
    try {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        throw new Error('JWT_SECRET not configured');
      }

      const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();

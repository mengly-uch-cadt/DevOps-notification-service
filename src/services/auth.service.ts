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

export interface SingleIdResponse {
  status: string;
  message: string | null;
  data: {
    token: string;
    user: {
      user_id: string;
      name: string;
    };
  } | null;
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

      // Get Single ID system settings from database
      const [urlSetting, tokenSetting, originSetting] = await Promise.all([
        this.prisma.settings.findFirst({
          where: {
            slug: 'single_id_sys_url',
            key: 'single_id_sys_url',
          },
        }),
        this.prisma.settings.findFirst({
          where: {
            slug: 'single_id_sys_token',
            key: 'single_id_sys_token',
          },
        }),
        this.prisma.settings.findFirst({
          where: {
            slug: 'single_id_sys_origin',
            key: 'single_id_sys_origin',
          },
        }),
      ]);

      if (!urlSetting || !tokenSetting || !originSetting) {
        console.error('Single ID system settings not configured');
        return null;
      }

      // Call Single ID system to validate user
      // Basic Auth: username = origin (current service URL), password = token
      const basicAuth = Buffer.from(`${originSetting.value}:${tokenSetting.value}`).toString('base64');

      const response = await fetch(`${urlSetting.value}/api/private/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          user_id: decoded.user_id,
          hash: decoded.hash,
        }),
      });

      if (!response.ok) {
        console.error('Single ID validation failed:', response.status);
        return null;
      }

      const sidResponse = await response.json() as SingleIdResponse;

      if (sidResponse.status !== 'success' || !sidResponse.data?.user) {
        return null;
      }

      // Find or create user in local database
      let user = await this.prisma.users.findFirst({
        where: {
          user_id: decoded.user_id,
        },
      });

      if (!user) {
        // Create user if doesn't exist
        user = await this.prisma.users.create({
          data: {
            global_id: decoded.user_id,
            user_id: decoded.user_id,
            name: sidResponse.data.user.name,
            hash: decoded.hash,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
      }

      // Get JWT TTL from settings
      const jwtTtlSetting = await this.prisma.settings.findFirst({
        where: {
          slug: 'jwt_ttl',
          key: 'jwt_ttl',
        },
      });

      const ttlMinutes = jwtTtlSetting ? parseInt(jwtTtlSetting.value) : 1440; // Default 24 hours

      // Generate new JWT token
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

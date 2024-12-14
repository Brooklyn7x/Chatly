import { Redis } from "ioredis";
import { DatabaseService } from "./database.service";
import { LoginDTO, RegisterDTO, TokenPayload } from "../types/auth.types";
import { ServiceResponse } from "../types/common/service-respone";

import Logger from "../utils/logger";
import jwt from "jsonwebtoken";
import { UserService } from "./user.service";

const bcrypt = require("bcrypt");

export class AuthService {
  private redis: Redis;
  private db: DatabaseService;
  private user: UserService;
  private logger: Logger;

  private readonly ACCESS_TOKEN_EXPIRY = "1h";
  private readonly REFRESH_TOKEN_EXPIRY = "7d";
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOGIN_BLOCK_DURATION = 15 * 60;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL as string);
    this.db = new DatabaseService();
    this.user = new UserService();
    this.logger = new Logger("AuthService");
  }

  async register(data: RegisterDTO): Promise<ServiceResponse<any>> {
    try {
      const existingUser = await this.user.findByEmail(data.email);
      if (existingUser.success) {
        return {
          success: false,
          error: "Email already registered",
        };
      }

      const hashPassword = await bcrypt.hash(data.password, 12);

      const user = await this.user.createUser({
        ...data,
        password: hashPassword,
      });

      const tokens = await this.generateAuthTokens(user.data!.id);

      await this.storeRefreshToken(user.data!.id, tokens.refreshToken);

      return {
        success: true,
        data: {
          ...tokens,
          user: user.data,
        },
      };
    } catch (error) {
      this.logger.error("Register error:", error);
      return {
        success: false,
        error: "Register failed",
      };
    }
  }

  async login(data: LoginDTO): Promise<ServiceResponse<any>> {
    try {
      const attempts = await this.getLoginAttempts(data.email);
      if (attempts >= this.MAX_LOGIN_ATTEMPTS) {
        return {
          success: false,
          error: "Account temporarily locked. Please try again later.",
        };
      }

      const user = await this.user.findByEmail(data.email);
      if (!user.success || !user.data) {
        await this.incrementLoginAttempts(data.email);
        return {
          success: false,
          error: "Invalid credentials",
        };
      }

      const isValidPassword = await bcrypt.compare(
        data.password,
        user.data.password
      );
      if (!isValidPassword) {
        await this.incrementLoginAttempts(data.email);
        return {
          success: false,
          error: "Invalid data",
        };
      }

      await this.clearLoginAttempts(data.email);

      const tokens = await this.generateAuthTokens(user.data!.id);

      await this.storeRefreshToken(user.data!.id, tokens.refreshToken);

      return {
        success: true,
        data: {
          ...tokens,
          user,
        },
      };
    } catch (error) {
      this.logger.error("Login error:", error);
      return {
        success: false,
        error: "Login failed",
      };
    }
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    // try {
    //   await this.removeRefreshToken(userId);
    //   return { success: true };
    // } catch (error) {
    //   this.logger.error("Logout error:", error);
    //   return {
    //     success: false,
    //     error: "Logout failed",
    //   };
    // }
  }

  private async generateAuthTokens(userId: string): Promise<any> {
    const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1h
    };
  }

  async refreshToken(refreshToken: string): Promise<ServiceResponse<any>> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as TokenPayload;

      const storedToken = await this.redis.get(decoded.userId);
      if (!storedToken || storedToken !== refreshToken) {
        return {
          success: false,
          error: "Invalid refresh token",
        };
      }

      const tokens = await this.generateAuthTokens(decoded.userId);

      await this.storeRefreshToken(decoded.userId, tokens.refreshToken);

      return {
        success: true,
        data: tokens,
      };
    } catch (error) {
      this.logger.error("Token refresh error:", error);
      return {
        success: false,
        error: "Token refresh failed",
      };
    }
  }

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!
      ) as TokenPayload;

      if (!decoded.userId) {
        return {
          success: false,
          error: "Invalid token payload",
        };
      }

      return { success: true, data: decoded };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return {
          success: false,
          error: "Token has expired",
        };
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return {
          success: false,
          error: "Invalid token signature",
        };
      }

      this.logger.error("Token validation error:", error);
      return {
        success: false,
        error: "Token validation failed",
      };
    }
  }

  private async storeRefreshToken(
    userId: string,
    token: string
  ): Promise<void> {
    const session = { userId, lastActive: new Date() };
    const pipeline = this.redis.pipeline();
    pipeline.hset(`session:${userId}`, {
      ...session,
      lastActive: session.lastActive.toISOString(),
    });
    pipeline.sadd(`user:${userId}:sessions`);
    pipeline.expire(`session:${userId}`, 7 * 24 * 60 * 60);
    await pipeline.exec();
  }

  private async incrementLoginAttempts(email: string): Promise<void> {
    const key = `login_attempts:${email}`;
    await this.redis.incr(key);
    await this.redis.expire(key, this.LOGIN_BLOCK_DURATION);
  }

  private async getLoginAttempts(email: string): Promise<number> {
    const attempts = await this.redis.get(`login_attempts:${email}`);
    return attempts ? parseInt(attempts) : 0;
  }

  private async clearLoginAttempts(email: string): Promise<void> {
    await this.redis.del(`login_attempts:${email}`);
  }
}

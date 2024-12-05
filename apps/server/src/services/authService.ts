import { Redis } from "ioredis";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { AppError, ErrorCodes } from "../utils/error";
import { config } from "../config/config";
import { IAuthResponse, ILoginDto, IRegisterDto } from "../types/auth.types";

export class AuthService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(config.redis);
  }
  async register(registerDto: IRegisterDto): Promise<IAuthResponse> {
    try {
      const existingUser = await User.findOne({ email: registerDto.email });
      if (existingUser) {
        throw new AppError(400, "Email already registered");
      }

      const user = await User.create(registerDto);

      const tokens = this.generateToken(user._id);

      await this.storeRefreshToken(user._id, tokens.refreshToken);

      return {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        tokens,
      };
    } catch (error) {
      throw new Error(`Registration error: ${(error as Error).message}`);
    }
  }

  async login(loginDto: ILoginDto): Promise<IAuthResponse> {
    try {
      const user = await User.findOne({ email: loginDto.email });
      if (!user) {
        throw new Error("User not found");
      }
      const isPasswordValid = await user.comparePassword(loginDto.password);
      if (!isPasswordValid) {
        throw new AppError(401, "Invalid credentials");
      }
      const tokens = this.generateToken(user._id);

      await this.storeRefreshToken(user._id, tokens.refreshToken);

      return {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        tokens,
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(userId: string): Promise<void> {
    try {
      await this.redis.del(`refresh_token:${userId}`);
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<IAuthResponse> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
        userId: string;
      };
      const storedToken = await this.redis.get(
        `refresh_token:${decoded.userId}`
      );

      if (!storedToken || storedToken !== refreshToken) {
        throw new AppError(
          401,
          "Invalid refresh token",
          ErrorCodes.UNAUTHORIZED
        );
      }

      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new AppError(401, "User not found", ErrorCodes.USER_NOT_FOUND);
      }

      const tokens = await this.generateToken(user._id);
      await this.storeRefreshToken(user._id, tokens.refreshToken);

      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        tokens,
      };
    } catch (error) {
      throw error;
    }
  }

  private generateToken(userId: string) {
    const accessToken = jwt.sign({ userId }, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessTokenExpire,
    });
    const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshTokenExpire,
    });

    return { accessToken, refreshToken };
  }

  async verifyToken(token: string) {
    try {
      if (!config.jwt.accessSecret) {
        throw new Error("JWT_SECRET is not defined");
      }
      const decoded = jwt.verify(token, config.jwt.accessSecret) as {
        userId: string;
      };
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new AppError(401, "User not found", ErrorCodes.UNAUTHORIZED);
      }

      return user;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError(401, "Invalid token", ErrorCodes.UNAUTHORIZED);
      }
    }
  }

  private async storeRefreshToken(userId: string, refreshToken: string) {
    await this.redis.setex(
      `refresh_token:${userId}`,
      7 * 24 * 60 * 60,
      refreshToken
    );
  }
}

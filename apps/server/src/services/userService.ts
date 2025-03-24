import Redis from "ioredis";
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserProfile,
  UserStatus,
} from "../types/user";
import { Logger } from "../utils/logger";
import { ServiceResponse } from "../types/service-respone";
import { UserModel } from "../models/user";
import redisClient from "../config/redis";
const bcrypt = require("bcrypt");

export class UserService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger("UserService");
  }

  async createUser(data: CreateUserDTO): Promise<ServiceResponse<any>> {
    try {
      const existingUser = await this.findByEmail(data.email);
      if (existingUser.success) {
        return {
          success: false,
          error: "Email already registered",
        };
      }
      const userData = {
        ...data,
        status: UserStatus.OFFLINE,
        lastSeen: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const user = await UserModel.create(userData);
      await this.cacheUserProfile(user);

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      this.logger.error("Error creating user:", error);
      return {
        success: false,
        error: "Failed to create user",
      };
    }
  }

  async getUserStatus(userId: string): Promise<ServiceResponse<any>> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      return {
        success: true,
        data: user.get("status"),
      };
    } catch (error) {
      this.logger.error("Error fetching user status:", error);
      return {
        success: false,
        error: "Failed to fetch user status",
      };
    }
  }

  async getUserById(id: string): Promise<ServiceResponse<UserProfile>> {
    try {
      const cacheUser = await redisClient.hgetall(`user${id}`);
      if (Object.keys(cacheUser).length > 0) {
        return {
          success: true,
          data: this.parseCacheUser(cacheUser),
        };
      }

      const user = await UserModel.findById(id);
      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      await this.cacheUserProfile(user);

      return {
        success: true,
        data: this.formatUserProfile(user),
      };
    } catch (error) {
      this.logger.error("Error fetching user:", error);
      return {
        success: false,
        error: "Failed to fetch user",
      };
    }
  }

  async findByEmail(email: string): Promise<ServiceResponse<any>> {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      this.logger.error("Error finding user by email:", error);
      return {
        success: false,
        error: "Failed to find user",
      };
    }
  }

  async updateUser(
    id: string,
    data: UpdateUserDTO
  ): Promise<ServiceResponse<UserProfile>> {
    try {
      if (data.email) {
        const existingUser = await UserModel.findOne({
          email: data.email,
        });

        if (existingUser && existingUser.id !== id) {
          return {
            success: false,
            error: "Email already in use",
          };
        }
      }

      if (data.username) {
        const existingUser = await UserModel.findOne({
          username: data.username,
        });

        if (existingUser && existingUser.id !== id) {
          return {
            success: false,
            error: "Username already taken.",
          };
        }
      }

      if (data.newPassword) {
        const user = await UserModel.findById(id);
        if (!user) {
          return {
            success: false,
            error: "User not found",
          };
        }

        const isPasswordValid = await bcrypt.compare(
          data.currentPassword,
          user.password
        );

        if (!isPasswordValid) {
          return {
            success: false,
            error: "Current password is incorrect",
          };
        }
        data.newPassword = await bcrypt.hash(data.newPassword, 12);
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        {
          ...data,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      ).select("-password -__v");

      if (!updatedUser) {
        return {
          success: false,
          error: "User not found",
        };
      }

      await this.cacheUserProfile(updatedUser);

      return {
        success: true,
        data: this.formatUserProfile(updatedUser),
      };
    } catch (error) {
      this.logger.error("Error updating user:", error);
      return {
        success: false,
        error: "Failed to update user. Try Again",
      };
    }
  }

  async updateUserStatus(userId: string, status: UserStatus) {
    try {
      await Promise.all([
        UserModel.findByIdAndUpdate({
          _id: userId,
          status,
          lastSeen: new Date(),
          updatedAt: new Date(),
        }),

        redisClient.hset(`user:${userId}`, {
          status,
          lastSeen: new Date().toISOString(),
        }),
      ]);

      return { data: status, success: true };
    } catch (error) {
      this.logger.error("Error updating user status:", error);
      return {
        success: false,
        error: "Failed to update user status",
      };
    }
  }

  async searchUsers(
    query: string,
    currentUserId: string,
    options: { limit?: number; offset?: number }
  ): Promise<ServiceResponse<any>> {
    try {
      const { limit = 10, offset = 0 } = options;
      const searchQuery = {
        _id: { $ne: currentUserId },
        $or: [
          { username: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { name: { $regex: query, $options: "i" } },
        ],
      };

      const [users, total] = await Promise.all([
        UserModel.find(searchQuery)
          .select("-password -__v -createdAt -updatedAt")
          .skip(offset)
          .limit(limit)
          .lean(),
        UserModel.countDocuments(searchQuery),
      ]);

      return {
        success: true,
        data: {
          results: users.map((user) => ({
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            avatar: user.profilePicture,
            status: user.status,
            lastSeen: user.lastSeen,
          })),
          pagination: {
            total,
            limit,
            offset,
            hasMore: total > offset + limit,
          },
        },
      };
    } catch (error) {
      this.logger.error("Error searching users:", error);
      return {
        success: false,
        error: "Failed to search users",
      };
    }
  }

  private async cacheUserData(user: any): Promise<any> {
    await redisClient.hset(`user:${user.id}`, {
      id: user.id,
      username: user.username,
      status: user.status,
      lastSeen: user.lastSeen.toISOString(),
    });

    await redisClient.expire(`user:${user.id}`, 3600);
  }

  private parseCacheUser(data: Record<string, string>): UserProfile {
    return {
      id: data.id,
      username: data.username,
      status: data.status as UserStatus,
      lastSeen: new Date(data.lastSeen),
    };
  }

  private async cacheUserProfile(user: any): Promise<void> {
    const profile = this.formatUserProfile(user);
    await redisClient.hmset(`user:${user.id}`, this.flattenObject(profile));
    await redisClient.expire(`user:${user.id}`, 3600);
  }

  private formatUserProfile(user: any): UserProfile {
    return {
      id: user.id,
      username: user.username,
      profilePicture: user.profilePicture,
      status: user.status,
      lastSeen: user.lastSeen,
    };
  }

  private flattenObject(obj: any, prefix = ""): Record<string, string> {
    const flattened: Record<string, string> = {};

    for (const key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "object" && value !== null) {
        Object.assign(flattened, this.flattenObject(value, newKey));
      } else {
        flattened[newKey] = value.toString();
      }
    }

    return flattened;
  }
}

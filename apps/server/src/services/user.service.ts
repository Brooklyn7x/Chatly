import Redis from "ioredis";
import { DatabaseService } from "./database.service";
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserProfile,
  UserStatus,
} from "../types/user.types";
import { Logger } from "../utils/logger";
import { ServiceResponse } from "../types/service-respone";
const bcrypt = require("bcrypt");

export class UserService {
  private redis: Redis;
  private db: DatabaseService;
  private logger: Logger;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL as string);
    this.db = new DatabaseService();
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
      const user = await this.db.create<any>("user", userData);
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

  async getUserById(id: string): Promise<ServiceResponse<UserProfile>> {
    try {
      const cacheUser = await this.redis.hgetall(`user${id}`);
      if (Object.keys(cacheUser).length > 0) {
        return {
          success: true,
          data: this.parseCacheUser(cacheUser),
        };
      }

      const user = await this.db.findById("user", id);
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
      const user = await this.db.findOne<any>("user", { email });
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
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 12);
      }

      if (data.email) {
        const existingUser = await this.findByEmail(data.email);
        if (existingUser.success && existingUser.data?.id !== id) {
          return {
            success: false,
            error: "Email already in use",
          };
        }
      }

      const updateUser = await this.db.findByIdAndUpdate<any>("user", id, {
        ...data,
        updatedAt: new Date(),
      });

      if (!updateUser) {
        return {
          success: true,
          error: "User not found",
        };
      }

      await this.cacheUserProfile(updateUser);

      return {
        success: true,
        data: this.formatUserProfile(updateUser),
      };
    } catch (error) {
      this.logger.error("Error updating user:", error);
      return {
        success: false,
        error: "Failed to update user",
      };
    }
  }

  async updateUserStatus(id: string, status: UserStatus) {
    try {
      await Promise.all([
        this.db.findByIdAndUpdate<any>("user", id, {
          status,
          lastSeen: new Date(),
          updatedAt: new Date(),
        }),

        this.redis.hset(`user:${id}`, {
          status,
          lastSeen: new Date().toISOString(),
        }),
      ]);

      return { success: true };
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
    options: {
      limit?: number;
      offset?: number;
    }
  ): Promise<ServiceResponse<any>> {
    try {
      const { limit = 10, offset = 0 } = options;

      const searchQuery = {
        $or: [
          { username: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      };

      const users = await this.db.find("user", searchQuery, {
        limit,
        skip: offset,
        projection: {
          id: 1,
          username: 1,
          email: 1,
          name: 1,
          avatar: 1,
          status: 1,
          lastSeen: 1,
        },
        sort: { username: 1 },
      });

      return {
        success: true,
        data: {
          users,
          pagination: {
            limit,
            offset,
            total: users.length,
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
    await this.redis.hset(`user:${user.id}`, {
      id: user.id,
      username: user.username,
      status: user.status,
      lastSeen: user.lastSeen.toISOString(),
    });

    await this.redis.expire(`user:${user.id}`, 3600);
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
    await this.redis.hmset(`user:${user.id}`, this.flattenObject(profile));
    await this.redis.expire(`user:${user.id}`, 3600);
  }

  private formatUserProfile(user: any): UserProfile {
    return {
      id: user.id,
      username: user.username,
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

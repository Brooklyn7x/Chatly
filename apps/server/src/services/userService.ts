import Redis from "ioredis";
import { User } from "../models/user.model";
import { AppError } from "../utils/error";
import { ISearchQuery, IUpdateUserData } from "../types/user.types";

export class UserService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });
  }

  async getUserById(userId: string) {
    try {
      const cacheUser = await this.redis.get(`user:${userId}`);
      if (cacheUser) {
        return JSON.parse(cacheUser);
      }

      const user = await User.findById(userId).select("-password").lean();
      if (!user) {
        throw new AppError(404, "User not found");
      }

      await this.redis.setex(`user:${userId}`, 3600, JSON.stringify(user));

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId: string, updateData: IUpdateUserData) {
    try {
      if (updateData.email) {
        const existingUser = await User.findOne({
          email: updateData.email,
          _id: { $ne: userId },
        });

        if (existingUser) {
          throw new AppError(400, "Email already in use");
        }
      }

      const updateUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, select: "-password" }
      );
      if (!updateUser) {
        throw new AppError(404, "User not found");
      }
      await this.redis.del(`user:${userId}`);

      return updateUser;
    } catch (error) {
      throw error;
    }
  }

  async searchUser(query: ISearchQuery) {
    try {
      const { search = "", page = 1, limit = 10 } = query;

      const searchQuery = search
        ? {
            $or: [
              { name: { $regex: search, $option: "i" } },
              { email: { $regex: search, $option: "i" } },
            ],
          }
        : {};

      const users = await User.find(searchQuery)
        .select("-password")
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const total = await User.countDocuments(searchQuery);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId: string) {
    try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        throw new AppError(404, "User not found");
      }

      await this.redis.del(`user:${userId}`);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async getSuggestion(userId: string) {}
}

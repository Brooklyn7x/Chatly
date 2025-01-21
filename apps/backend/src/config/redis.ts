import { Redis } from "ioredis";
import { Logger } from "../utils/logger";
import { config } from "./config";

export class RedisService {
  private static instance: Redis | null = null;
  private static logger: Logger = new Logger("RedisService");

  static getInstance(): Redis {
    if (!RedisService.instance) {
      RedisService.instance = new Redis({
        host: config.redis.host || "127.0.0.1",
        port: config.redis.port,
        retryStrategy: config.redis.retryStrategy,
        maxRetriesPerRequest: config.redis.maxRetriesPerRequest,
        enableReadyCheck: true,
      });

      RedisService.instance.on("connect", () => {
        RedisService.logger.info("Redis connected successfully");
      });

      RedisService.instance.on("error", (error) => {
        RedisService.logger.error("Redis connection error:", error);
      });

      RedisService.instance.on("close", () => {
        RedisService.logger.info("Redis connection closed");
      });
    }

    return RedisService.instance;
  }
}

import { Redis } from "ioredis";
import { Logger } from "../utils/logger";
import { config } from "./config";

// export class RedisService {
//   private static instance: Redis | null = null;
//   private static logger: Logger = new Logger("RedisService");
//   private static reconnectAttempts = 0;
//   private static maxReconnectAttempts = 20;

//   static getInstance(): Redis {
//     if (!RedisService.instance) {
//       RedisService.instance = new Redis({
//         host: config.redis.host,
//         port: config.redis.port,
//         retryStrategy: config.redis.retryStrategy,
//         maxRetriesPerRequest: config.redis.maxRetriesPerRequest,
//         enableReadyCheck: true,
//       });

//       RedisService.instance.on("connect", () => {
//         RedisService.logger.info("Redis connected successfully");
//       });

//       RedisService.instance.on("error", (error) => {
//         RedisService.logger.error("Redis connection error:", error);
//       });

//       RedisService.instance.on("close", () => {
//         RedisService.logger.info("Redis connection closed");
//       });
//     }

//     return RedisService.instance;
//   }
// }

export class RedisService {
  private static instance: Redis | null = null;
  private static logger: Logger = new Logger("RedisService");
  private static reconnectAttempts = 0;
  private static maxReconnectAttempts = 20;

  static getInstance(): Redis {
    if (!RedisService.instance) {
      RedisService.instance = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        retryStrategy: (times: number) => {
          if (
            RedisService.reconnectAttempts >= RedisService.maxReconnectAttempts
          ) {
            RedisService.logger.error("Max reconnection attempts reached");
            return null; // Stop retrying
          }
          RedisService.reconnectAttempts++;
          return config.redis.retryStrategy(times);
        },
        maxRetriesPerRequest: config.redis.maxRetriesPerRequest,
        enableReadyCheck: true,
        lazyConnect: true, // Only connect when needed
        connectTimeout: config.redis.connectTimeout,
        enableAutoPipelining: config.redis.enableAutoPipelining,
      });

      RedisService.instance.on("connect", () => {
        RedisService.logger.info("Redis connected successfully");
        RedisService.reconnectAttempts = 0; // Reset counter on successful connection
      });

      RedisService.instance.on("error", (error) => {
        RedisService.logger.error("Redis connection error:", error);
      });

      RedisService.instance.on("close", () => {
        RedisService.logger.info("Redis connection closed");
      });

      RedisService.instance.on("reconnecting", (delay: number) => {
        RedisService.logger.info(`Reconnecting to Redis in ${delay}ms...`);
      });
    }

    return RedisService.instance;
  }

  static async closeConnection(): Promise<void> {
    if (RedisService.instance) {
      await RedisService.instance.quit();
      RedisService.instance = null;
      RedisService.logger.info("Redis connection closed gracefully");
    }
  }
}

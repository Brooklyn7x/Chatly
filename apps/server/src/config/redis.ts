import { Redis, RedisOptions } from "ioredis";
import { config } from "./config";
import {Logger }from "../utils/logger";

export class RedisService {
  private static instance: Redis;
  private static logger: Logger = new Logger("RedisService");

  static getInstance(): Redis {
    if (!RedisService.instance) {
      const options: RedisOptions = {
        host: config.redis.host,
        port: config.redis.port,
        retryStrategy(times) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      };

      RedisService.instance = new Redis(options);

      RedisService.instance.on("error", (error) => {
        RedisService.logger.error("Redis connection error:", error);
      });
    }

    return RedisService.instance;
  }
}

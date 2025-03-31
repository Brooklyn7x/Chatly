import Redis from "ioredis";
import logger from "./logger";
import "dotenv/config";

const redisClient = new Redis(process.env.REDIS_URI as string);

redisClient.on("connect", () => logger.info("Connected to Redis"));
redisClient.on("error", (err) => logger.error(`Redis Client Error: ${err}`));

export default redisClient;

import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 8001,
  mongodb: process.env.MONGO_URL || "",
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
    url: process.env.REDIS_URL,
  },
  jwt: {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: "24h",
  },
};

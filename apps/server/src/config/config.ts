import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  mongodb: process.env.MONGO_URL || "",
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
  jwt: {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: "24h",
  },
};

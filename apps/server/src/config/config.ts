import dotenv from "dotenv";

dotenv.config();

const url =
  "mongodb+srv://cha-app:db01@cluster0.e8bga.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const config = {
  port: process.env.PORT || 8000,
  mongodb: {
    url,
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "",
    authSecret: process.env.JWT_AUTH_SECRET || "",
    accessTokenExpire: "30m",
    refreshTokenExpire: "7d",
  },
};

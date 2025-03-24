import mongoose from "mongoose";
import logger from "./logger";
import "dotenv/config";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI as string);
    logger.info("MongoDB Connected");

    mongoose.connection.on("disconnected", () => {
      logger.info("MongoDB disconnected");
    });
    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
      process.exit(1);
    });
  } catch (error) {
    logger.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;

// src/utils/logger.ts
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

class Logger {
  private logger: winston.Logger;

  constructor(service?: string) {
    const logDir = "logs";

    // Define log format
    const logFormat = winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      winston.format.errors({ stack: true }),
      winston.format.json()
    );

    // Create logger instance
    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      defaultMeta: { service },
      format: logFormat,
      transports: [
        // Console transport for development
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),

        // Rotating file transport for errors
        new DailyRotateFile({
          filename: path.join(logDir, "error-%DATE%.log"),
          datePattern: "YYYY-MM-DD",
          level: "error",
          maxFiles: "30d",
          maxSize: "20m",
        }),

        // Rotating file transport for all logs
        new DailyRotateFile({
          filename: path.join(logDir, "combined-%DATE%.log"),
          datePattern: "YYYY-MM-DD",
          maxFiles: "30d",
          maxSize: "20m",
        }),
      ],
    });
  }

  info(message: string, meta: Record<string, any> = {}) {
    this.logger.info(message, meta);
  }

  error(message: string, error?: any) {
    this.logger.error(message, {
      error: error?.message,
      stack: error?.stack,
    });
  }

  warn(message: string, meta: Record<string, any> = {}) {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta: Record<string, any> = {}) {
    this.logger.debug(message, meta);
  }
}

export default Logger;

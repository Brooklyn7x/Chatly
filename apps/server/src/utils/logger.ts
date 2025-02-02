import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

export class Logger {
  private logger: winston.Logger;

  constructor(service?: string) {
    const logDir = "logs";

    const logFormat = winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      winston.format.errors({ stack: true }),
      winston.format.json()
    );
    
    if (!Logger.instance) {
      Logger.instance = winston.createLogger({
        level: process.env.NODE_ENV === "production" ? "info" : "debug",
        defaultMeta: { service },
        format: logFormat,
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            ),
          }),

          new DailyRotateFile({
            filename: path.join(logDir, "error-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            level: "error",
            maxFiles: "30d",
            maxSize: "20m",
          }),

          new DailyRotateFile({
            filename: path.join(logDir, "combined-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            maxFiles: "30d",
            maxSize: "20m",
          }),
        ],
      });
    }

    // Return the instance
    this.logger = Logger.instance;
  }

  // Instance to store logger
  private static instance: winston.Logger;

  // Instance getter (for reusing the same logger instance)
  static getInstance(service?: string): winston.Logger {
    return new Logger(service).logger;
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



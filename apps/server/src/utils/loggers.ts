import winston from "winston";
import "winston-daily-rotate-file";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.colorize()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      level: "error",
      datePattern: "YYYY-MM-DD",
    }),
    new winston.transports.DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
    }),
    new winston.transports.Console(),
  ],
});

export default logger;

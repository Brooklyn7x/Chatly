import { createLogger, format, transports } from "winston";
import { LogtailTransport } from "@logtail/winston";
import { Logtail } from "@logtail/node";
import "dotenv/config";

const logtail = new Logtail(process.env.LOGID as string, {
  endpoint: process.env.LOG_URL as string,
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/app.log" }),
    new LogtailTransport(logtail),
  ],
});

export default logger;

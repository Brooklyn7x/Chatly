import "dotenv/config";
import { createLogger, format, transports } from "winston";


const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.json(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [new transports.Console()],
});

export default logger;

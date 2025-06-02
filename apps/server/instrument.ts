import * as Sentry from "@sentry/node";
import "dotenv/config";

Sentry.init({
  dsn: process.env.SENTRY as string,
  sendDefaultPii: true,
  environment: "devlopmemnt",
  debug: true,
  release: "v1.0.0",
});

export default Sentry;

import * as Sentry from "@sentry/node";

import dotenv from "dotenv";
dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY as string,
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  release: "chatly@" + 1,
  enabled: true,
});

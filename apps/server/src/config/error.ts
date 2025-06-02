import Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://f24fb228e99af8f8869fea9746ba9b42@o4506155507843072.ingest.us.sentry.io/4509428770668544",
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
});

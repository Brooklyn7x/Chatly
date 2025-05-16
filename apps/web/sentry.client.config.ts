import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://5a4b65005a417dc2547049e65ac7011c@o4506155507843072.ingest.us.sentry.io/4509331188416512",
  tracesSampleRate: 1.0,
});

import * as Sentry from "@sentry/astro";

Sentry.init({
    dsn: "https://74a5458921d2e070f974160bd17ef9a4@o4510429009674240.ingest.us.sentry.io/4510429062037504",
    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/astro/configuration/options/#sendDefaultPii
    sendDefaultPii: true,
});

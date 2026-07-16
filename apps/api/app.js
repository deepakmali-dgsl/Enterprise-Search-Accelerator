require("dotenv").config();

const cors = require("cors");
const express = require("express");
const searchRoutes = require("./routes/searchRoutes");
const syncRoutes = require("./routes/syncRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const logger = require("./utils/logger");

const app = express();
const port = Number(process.env.PORT) || 3001;

app.disable("x-powered-by");
app.use(cors());
app.use(
  express.json({
    limit: "1mb",
    type: ["application/json", "application/vnd.contentful.management.v1+json"],
    verify: (req, _res, buffer) => {
      req.rawBody = buffer;
    },
  })
);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/search", searchRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/webhook", webhookRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.originalUrl} does not exist.`,
  });
});

app.use((error, _req, res, _next) => {
  const statusCode =
    error.statusCode || (error.type === "entity.parse.failed" ? 400 : 502);
  const message =
    statusCode >= 500 ? "The request could not be processed." : error.message;

  logger.error("api.request.failed", {
    statusCode,
    error: error.message,
  });
  res.status(statusCode).json({ error: message });
});

if (require.main === module) {
  app.listen(port, () => {
    console.info(JSON.stringify({ event: "api.started", port }));
  });
}

module.exports = app;

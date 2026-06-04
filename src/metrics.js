const promClient = require("prom-client");

function createMetrics() {
  const register = new promClient.Registry();

  promClient.collectDefaultMetrics({ register });

  const httpRequestsTotal = new promClient.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests processed by the API.",
    labelNames: ["method", "route", "status_code"],
    registers: [register],
  });

  const httpRequestDurationSeconds = new promClient.Histogram({
    name: "http_request_duration_seconds",
    help: "HTTP request duration in seconds.",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
    registers: [register],
  });

  const metricsMiddleware = (req, res, next) => {
    if (req.path === "/metrics") {
      return next();
    }

    const endTimer = httpRequestDurationSeconds.startTimer();

    res.on("finish", () => {
      const route = req.route?.path
        ? `${req.baseUrl || ""}${req.route.path}`
        : req.path;
      const labels = {
        method: req.method,
        route,
        status_code: String(res.statusCode),
      };

      httpRequestsTotal.inc(labels);
      endTimer(labels);
    });

    next();
  };

  const metricsHandler = async (req, res, next) => {
    try {
      res.setHeader("Content-Type", register.contentType);
      res.end(await register.metrics());
    } catch (error) {
      next(error);
    }
  };

  return {
    register,
    httpRequestsTotal,
    httpRequestDurationSeconds,
    metricsMiddleware,
    metricsHandler,
  };
}

module.exports = {
  createMetrics,
};

const express = require("express");
const taskRoutes = require("./routes/tasks");
const errorHandler = require("./middleware/errorHandler");
const { createMetrics } = require("./metrics");

const app = express();
const { metricsMiddleware, metricsHandler } = createMetrics();

// Middleware
app.use(express.json());
app.use(metricsMiddleware);

// Routes
app.get("/", (req, res) => res.json({ message: "Bonjouuuur :)" }));
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/metrics", metricsHandler);
app.use("/tasks", taskRoutes);

// Error Handler
app.use(errorHandler);

const port = process.env.PORT || 3001;

app.listen(port, () =>
  console.log(`app listening on http://localhost:${port}`),
);

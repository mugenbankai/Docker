const express = require("express");
const taskRoutes = require("./routes/tasks");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => res.json({ message: "Bonjouuuur :)" }));
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/tasks", taskRoutes);

// Error Handler
app.use(errorHandler);

const port = process.env.PORT || 3001;

app.listen(port, () =>
  console.log(`app listening on http://localhost:${port}`),
);

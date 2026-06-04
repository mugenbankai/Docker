const express = require("express");
const request = require("supertest");
const { createMetrics } = require("../../src/metrics");

describe("metrics", () => {
  let app;

  beforeEach(() => {
    app = express();
    const { metricsMiddleware, metricsHandler } = createMetrics();

    app.use(express.json());
    app.use(metricsMiddleware);
    app.get("/health", (req, res) => res.json({ status: "ok" }));
    app.get("/error", (req, res) => res.status(500).json({ error: "boom" }));
    app.get("/metrics", metricsHandler);
  });

  it("exposes http_requests_total on /metrics", async () => {
    await request(app).get("/health");
    const response = await request(app).get("/metrics");

    expect(response.status).toBe(200);
    expect(response.text).toContain("http_requests_total");
    expect(response.text).toContain('route="/health"');
  });

  it("records errors with the right status code", async () => {
    await request(app).get("/error");
    const response = await request(app).get("/metrics");

    expect(response.status).toBe(200);
    expect(response.text).toContain('status_code="500"');
  });

  it("records 404 requests", async () => {
    await request(app).get("/not-found");
    const response = await request(app).get("/metrics");

    expect(response.status).toBe(200);
    expect(response.text).toContain('status_code="404"');
  });
});

const request = require("supertest");
const express = require("express");
const taskRoutes = require("../../src/routes/tasks");
const errorHandler = require("../../src/middleware/errorHandler");

describe("Tasks API", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/tasks", taskRoutes);
    app.use(errorHandler);
  });

  describe("POST /tasks", () => {
    it("should create a new task", async () => {
      const response = await request(app).post("/tasks").send({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe("Test Task");
      expect(response.body.description).toBe("Test Description");
      expect(response.body.status).toBe("pending");
    });

    it("should create task with default status", async () => {
      const response = await request(app).post("/tasks").send({
        title: "Task",
        description: "Description",
      });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("pending");
    });

    it("should return 400 if description is missing", async () => {
      const response = await request(app).post("/tasks").send({
        title: "Task",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Description is required");
    });
  });

  describe("GET /tasks", () => {
    it("should return empty array when no tasks", async () => {
      const response = await request(app).get("/tasks");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return all tasks", async () => {
      await request(app).post("/tasks").send({ description: "Task 1" });

      await request(app).post("/tasks").send({ description: "Task 2" });

      const response = await request(app).get("/tasks");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return task by id", async () => {
      const createResponse = await request(app).post("/tasks").send({
        title: "Test Task",
        description: "Test Description",
      });

      const taskId = createResponse.body.id;

      const response = await request(app).get(`/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(taskId);
      expect(response.body.title).toBe("Test Task");
    });

    it("should return 404 if task not found", async () => {
      const response = await request(app).get("/tasks/non-existent-id");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Task not found");
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update task", async () => {
      const createResponse = await request(app).post("/tasks").send({
        title: "Original Title",
        description: "Original Description",
        status: "pending",
      });

      const taskId = createResponse.body.id;

      const response = await request(app).put(`/tasks/${taskId}`).send({
        title: "Updated Title",
        description: "Updated Description",
        status: "completed",
      });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Updated Title");
      expect(response.body.description).toBe("Updated Description");
      expect(response.body.status).toBe("completed");
    });

    it("should update only provided fields", async () => {
      const createResponse = await request(app).post("/tasks").send({
        title: "Original Title",
        description: "Original Description",
      });

      const taskId = createResponse.body.id;

      const response = await request(app).put(`/tasks/${taskId}`).send({
        status: "completed",
      });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Original Title");
      expect(response.body.description).toBe("Original Description");
      expect(response.body.status).toBe("completed");
    });

    it("should return 404 if task not found", async () => {
      const response = await request(app)
        .put("/tasks/non-existent-id")
        .send({ status: "completed" });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Task not found");
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete task", async () => {
      const createResponse = await request(app)
        .post("/tasks")
        .send({ description: "Task to delete" });

      const taskId = createResponse.body.id;

      const deleteResponse = await request(app).delete(`/tasks/${taskId}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.id).toBe(taskId);

      const getResponse = await request(app).get(`/tasks/${taskId}`);
      expect(getResponse.status).toBe(404);
    });

    it("should return 404 if task not found", async () => {
      const response = await request(app).delete("/tasks/non-existent-id");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Task not found");
    });
  });
});

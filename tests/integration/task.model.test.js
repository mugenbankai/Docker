const TasksModel = require("../../src/models/tasks");

describe("TasksModel", () => {
  let tasksModel;

  beforeEach(async () => {
    tasksModel = new TasksModel();
    await tasksModel.clear();
  });

  describe("create", () => {
    it("should create a new task with required fields", async () => {
      const task = await tasksModel.create(
        "Test Title",
        "Test Description",
        "pending",
      );

      expect(task).toHaveProperty("id");
      expect(task.title).toBe("Test Title");
      expect(task.description).toBe("Test Description");
      expect(task.status).toBe("pending");
      expect(task).toHaveProperty("createdAt");
      expect(task).toHaveProperty("updatedAt");
    });

    it("should create a task with default status 'pending'", async () => {
      const task = await tasksModel.create("Title", "Description");
      expect(task.status).toBe("pending");
    });

    it("should create a task with empty title if not provided", async () => {
      const task = await tasksModel.create(null, "Description");
      expect(task.title).toBe("");
    });

    it("should add task to tasks array", async () => {
      await tasksModel.create("Title 1", "Description 1");
      await tasksModel.create("Title 2", "Description 2");
      const tasks = await tasksModel.getAll();
      expect(tasks.length).toBe(2);
    });
  });

  describe("getAll", () => {
    it("should return empty array when no tasks exist", async () => {
      const tasks = await tasksModel.getAll();
      expect(tasks).toEqual([]);
    });

    it("should return all created tasks", async () => {
      await tasksModel.create("Title 1", "Description 1");
      await tasksModel.create("Title 2", "Description 2");
      const tasks = await tasksModel.getAll();

      expect(tasks.length).toBe(2);
      expect(tasks.map((task) => task.title).sort()).toEqual([
        "Title 1",
        "Title 2",
      ]);
    });
  });

  describe("getById", () => {
    it("should return task by id", async () => {
      const createdTask = await tasksModel.create("Title", "Description");
      const foundTask = await tasksModel.getById(createdTask.id);

      expect(foundTask).toEqual(createdTask);
    });

    it("should return undefined if task not found", async () => {
      const unknownId = "00000000-0000-4000-8000-000000000000";
      const foundTask = await tasksModel.getById(unknownId);
      expect(foundTask).toBeUndefined();
    });
  });

  describe("update", () => {
    it("should update task title, description, and status", async () => {
      const createdTask = await tasksModel.create(
        "Old Title",
        "Old Description",
      );
      const updated = await tasksModel.update(
        createdTask.id,
        "New Title",
        "New Description",
        "completed",
      );

      expect(updated.title).toBe("New Title");
      expect(updated.description).toBe("New Description");
      expect(updated.status).toBe("completed");
    });

    it("should update only provided fields", async () => {
      const createdTask = await tasksModel.create(
        "Original Title",
        "Original Description",
        "pending",
      );
      const updated = await tasksModel.update(
        createdTask.id,
        undefined,
        "New Description",
      );

      expect(updated.title).toBe("Original Title");
      expect(updated.description).toBe("New Description");
      expect(updated.status).toBe("pending");
    });

    it("should update updatedAt timestamp", async () => {
      const createdTask = await tasksModel.create("Title", "Description");
      const originalUpdatedAt = new Date(createdTask.updatedAt).getTime();
      const updatedTask = await tasksModel.update(
        createdTask.id,
        "Updated Title",
      );
      const updatedAt = new Date(updatedTask.updatedAt).getTime();

      expect(updatedAt).toBeGreaterThanOrEqual(originalUpdatedAt);
    });

    it("should return null if task not found", async () => {
      const unknownId = "00000000-0000-4000-8000-000000000000";
      const updated = await tasksModel.update(unknownId, "Title");
      expect(updated).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete task by id", async () => {
      const task1 = await tasksModel.create("Title 1", "Description 1");
      await tasksModel.create("Title 2", "Description 2");

      const deleted = await tasksModel.delete(task1.id);
      const tasks = await tasksModel.getAll();
      const fromDb = await tasksModel.getById(task1.id);

      expect(deleted).toEqual(task1);
      expect(tasks.length).toBe(1);
      expect(fromDb).toBeUndefined();
    });

    it("should return null if task not found", async () => {
      const unknownId = "00000000-0000-4000-8000-000000000000";
      const deleted = await tasksModel.delete(unknownId);
      expect(deleted).toBeNull();
    });
  });

  describe("clear", () => {
    it("should clear all tasks", async () => {
      await tasksModel.create("Title 1", "Description 1");
      await tasksModel.create("Title 2", "Description 2");

      await tasksModel.clear();
      const tasks = await tasksModel.getAll();

      expect(tasks).toEqual([]);
    });
  });
});

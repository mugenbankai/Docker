const TasksModel = require("../../src/models/tasks");

describe("TasksModel", () => {
  let tasksModel;

  beforeEach(() => {
    tasksModel = new TasksModel();
  });

  describe("create", () => {
    it("should create a new task with required fields", () => {
      const task = tasksModel.create(
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

    it("should create a task with default status 'pending'", () => {
      const task = tasksModel.create("Title", "Description");
      expect(task.status).toBe("pending");
    });

    it("should create a task with empty title if not provided", () => {
      const task = tasksModel.create(null, "Description");
      expect(task.title).toBe("");
    });

    it("should add task to tasks array", () => {
      tasksModel.create("Title 1", "Description 1");
      tasksModel.create("Title 2", "Description 2");
      expect(tasksModel.getAll().length).toBe(2);
    });
  });

  describe("getAll", () => {
    it("should return empty array when no tasks exist", () => {
      expect(tasksModel.getAll()).toEqual([]);
    });

    it("should return all created tasks", () => {
      tasksModel.create("Title 1", "Description 1");
      tasksModel.create("Title 2", "Description 2");
      const tasks = tasksModel.getAll();

      expect(tasks.length).toBe(2);
      expect(tasks[0].title).toBe("Title 1");
      expect(tasks[1].title).toBe("Title 2");
    });
  });

  describe("getById", () => {
    it("should return task by id", () => {
      const createdTask = tasksModel.create("Title", "Description");
      const foundTask = tasksModel.getById(createdTask.id);

      expect(foundTask).toEqual(createdTask);
    });

    it("should return undefined if task not found", () => {
      const foundTask = tasksModel.getById("non-existent-id");
      expect(foundTask).toBeUndefined();
    });
  });

  describe("update", () => {
    it("should update task title, description, and status", () => {
      const createdTask = tasksModel.create("Old Title", "Old Description");
      const updated = tasksModel.update(
        createdTask.id,
        "New Title",
        "New Description",
        "completed",
      );

      expect(updated.title).toBe("New Title");
      expect(updated.description).toBe("New Description");
      expect(updated.status).toBe("completed");
    });

    it("should update only provided fields", () => {
      const createdTask = tasksModel.create(
        "Original Title",
        "Original Description",
        "pending",
      );
      const updated = tasksModel.update(
        createdTask.id,
        undefined,
        "New Description",
      );

      expect(updated.title).toBe("Original Title");
      expect(updated.description).toBe("New Description");
      expect(updated.status).toBe("pending");
    });

    it("should update updatedAt timestamp", () => {
      const createdTask = tasksModel.create("Title", "Description");
      const originalUpdatedAt = createdTask.updatedAt;

      setTimeout(() => {
        tasksModel.update(createdTask.id, "Updated Title");
        expect(createdTask.updatedAt).toBeGreaterThan(originalUpdatedAt);
      }, 10);
    });

    it("should return null if task not found", () => {
      const updated = tasksModel.update("non-existent-id", "Title");
      expect(updated).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete task by id", () => {
      const task1 = tasksModel.create("Title 1", "Description 1");
      const task2 = tasksModel.create("Title 2", "Description 2");

      const deleted = tasksModel.delete(task1.id);

      expect(deleted).toEqual(task1);
      expect(tasksModel.getAll().length).toBe(1);
      expect(tasksModel.getById(task1.id)).toBeUndefined();
    });

    it("should return null if task not found", () => {
      const deleted = tasksModel.delete("non-existent-id");
      expect(deleted).toBeNull();
    });
  });

  describe("clear", () => {
    it("should clear all tasks", () => {
      tasksModel.create("Title 1", "Description 1");
      tasksModel.create("Title 2", "Description 2");

      tasksModel.clear();

      expect(tasksModel.getAll()).toEqual([]);
    });
  });
});

const express = require("express");
const TasksModel = require("../models/tasks");

const router = express.Router();
const tasksModel = new TasksModel();
const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function ensureValidTaskId(taskId) {
  if (!UUID_V4_REGEX.test(taskId)) {
    const error = new Error("Task not found");
    error.status = 404;
    throw error;
  }
}

// POST /tasks - Créer une tâche
router.post("/", async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    if (!description) {
      const error = new Error("Description is required");
      error.status = 400;
      throw error;
    }

    const task = await tasksModel.create(
      title,
      description,
      status || "pending",
    );
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// GET /tasks - Lister toutes les tâches
router.get("/", async (req, res, next) => {
  try {
    const tasks = await tasksModel.getAll();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id - Voir une tâche
router.get("/:id", async (req, res, next) => {
  try {
    ensureValidTaskId(req.params.id);
    const task = await tasksModel.getById(req.params.id);

    if (!task) {
      const error = new Error("Task not found");
      error.status = 404;
      throw error;
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
});

// PUT /tasks/:id - Modifier une tâche
router.put("/:id", async (req, res, next) => {
  try {
    ensureValidTaskId(req.params.id);
    const task = await tasksModel.getById(req.params.id);

    if (!task) {
      const error = new Error("Task not found");
      error.status = 404;
      throw error;
    }

    const { title, description, status } = req.body;
    const updated = await tasksModel.update(
      req.params.id,
      title,
      description,
      status,
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id - Supprimer une tâche
router.delete("/:id", async (req, res, next) => {
  try {
    ensureValidTaskId(req.params.id);
    const deletedTask = await tasksModel.delete(req.params.id);

    if (!deletedTask) {
      const error = new Error("Task not found");
      error.status = 404;
      throw error;
    }

    res.json(deletedTask);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

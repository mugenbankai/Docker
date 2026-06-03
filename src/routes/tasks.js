const express = require("express");
const TasksModel = require("../models/tasks");

const router = express.Router();
const tasksModel = new TasksModel();

// POST /tasks - Créer une tâche
router.post("/", (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    if (!description) {
      const error = new Error("Description is required");
      error.status = 400;
      throw error;
    }

    const task = tasksModel.create(title, description, status || "pending");
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// GET /tasks - Lister toutes les tâches
router.get("/", (req, res) => {
  res.json(tasksModel.getAll());
});

// GET /tasks/:id - Voir une tâche
router.get("/:id", (req, res, next) => {
  try {
    const task = tasksModel.getById(req.params.id);

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
router.put("/:id", (req, res, next) => {
  try {
    const task = tasksModel.getById(req.params.id);

    if (!task) {
      const error = new Error("Task not found");
      error.status = 404;
      throw error;
    }

    const { title, description, status } = req.body;
    const updated = tasksModel.update(req.params.id, title, description, status);

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id - Supprimer une tâche
router.delete("/:id", (req, res, next) => {
  try {
    const deletedTask = tasksModel.delete(req.params.id);

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


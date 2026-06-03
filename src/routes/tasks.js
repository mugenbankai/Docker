const express = require("express");
const Task = require("../models/task");

const router = express.Router();
let tasks = [];

// POST /tasks - Créer une tâche
router.post("/", (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    if (!description) {
      const error = new Error("Description is required");
      error.status = 400;
      throw error;
    }

    const task = new Task(title, description, status || "pending");
    tasks.push(task);

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// GET /tasks - Lister toutes les tâches
router.get("/", (req, res) => {
  res.json(tasks);
});

// GET /tasks/:id - Voir une tâche
router.get("/:id", (req, res, next) => {
  try {
    const task = tasks.find((t) => t.id === req.params.id);

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
    const task = tasks.find((t) => t.id === req.params.id);

    if (!task) {
      const error = new Error("Task not found");
      error.status = 404;
      throw error;
    }

    const { title, description, status } = req.body;
    task.update(title, description, status);

    res.json(task);
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id - Supprimer une tâche
router.delete("/:id", (req, res, next) => {
  try {
    const index = tasks.findIndex((t) => t.id === req.params.id);

    if (index === -1) {
      const error = new Error("Task not found");
      error.status = 404;
      throw error;
    }

    const deletedTask = tasks.splice(index, 1);
    res.json(deletedTask[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const { v4: uuidv4 } = require("uuid");

class TasksModel {
  constructor() {
    this.tasks = [];
  }

  create(title, description, status = "pending") {
    const task = {
      id: uuidv4(),
      title: title || "",
      description,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.push(task);
    return task;
  }

  getAll() {
    return this.tasks;
  }

  getById(id) {
    return this.tasks.find((task) => task.id === id);
  }

  update(id, title, description, status) {
    const task = this.getById(id);
    if (!task) return null;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    task.updatedAt = new Date();

    return task;
  }

  delete(id) {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) return null;

    const deletedTask = this.tasks.splice(index, 1);
    return deletedTask[0];
  }

  clear() {
    this.tasks = [];
  }
}

module.exports = TasksModel;

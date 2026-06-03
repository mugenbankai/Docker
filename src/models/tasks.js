function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class TasksModel {
  constructor() {
    this.tasks = [];
  }

  create(title, description, status = "pending") {
    const task = {
      id: generateUUID(),
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


const { randomUUID } = require("crypto");
const { pool } = require("../db");

class TasksModel {
  static tableReady = null;

  constructor() {
    this.ready = TasksModel.ensureTableOnce();
  }

  static ensureTableOnce() {
    if (!TasksModel.tableReady) {
      TasksModel.tableReady = pool.query(
        `CREATE TABLE IF NOT EXISTS tasks (
          id UUID PRIMARY KEY,
          title TEXT,
          description TEXT NOT NULL,
          status TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );`,
      );
    }

    return TasksModel.tableReady;
  }

  async create(title, description, status = "pending") {
    await this.ready;
    const id = randomUUID();
    const taskTitle = title || "";

    const result = await pool.query(
      `INSERT INTO tasks (id, title, description, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, description, status,
                 created_at AS "createdAt",
                 updated_at AS "updatedAt"`,
      [id, taskTitle, description, status],
    );

    return result.rows[0];
  }

  async getAll() {
    await this.ready;
    const result = await pool.query(
      `SELECT id, title, description, status,
              created_at AS "createdAt",
              updated_at AS "updatedAt"
       FROM tasks
       ORDER BY created_at DESC`,
    );
    return result.rows;
  }

  async getById(id) {
    await this.ready;
    const result = await pool.query(
      `SELECT id, title, description, status,
              created_at AS "createdAt",
              updated_at AS "updatedAt"
       FROM tasks
       WHERE id = $1`,
      [id],
    );
    return result.rows[0];
  }

  async update(id, title, description, status) {
    await this.ready;
    const fields = [];
    const values = [];
    let index = 1;

    if (title !== undefined) {
      fields.push(`title = $${index++}`);
      values.push(title);
    }
    if (description !== undefined) {
      fields.push(`description = $${index++}`);
      values.push(description);
    }
    if (status !== undefined) {
      fields.push(`status = $${index++}`);
      values.push(status);
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE tasks
       SET ${fields.join(", ")},
           updated_at = NOW()
       WHERE id = $${index}
       RETURNING id, title, description, status,
                 created_at AS "createdAt",
                 updated_at AS "updatedAt"`,
      values,
    );

    return result.rows[0] || null;
  }

  async delete(id) {
    await this.ready;
    const result = await pool.query(
      `DELETE FROM tasks
       WHERE id = $1
       RETURNING id, title, description, status,
                 created_at AS "createdAt",
                 updated_at AS "updatedAt"`,
      [id],
    );
    return result.rows[0] || null;
  }

  async clear() {
    await this.ready;
    await pool.query("TRUNCATE TABLE tasks");
  }
}

module.exports = TasksModel;

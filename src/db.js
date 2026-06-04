const { Pool } = require("pg");

const { DATABASE_URL, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } =
  process.env;

const hasDbParts =
  DB_HOST && DB_PORT && DB_NAME && DB_USER && DB_PASSWORD !== undefined;

if (!DATABASE_URL && !hasDbParts) {
  throw new Error(
    "Configure DATABASE_URL or DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD.",
  );
}

const pool = DATABASE_URL
  ? new Pool({ connectionString: DATABASE_URL })
  : new Pool({
      host: DB_HOST,
      port: Number(DB_PORT),
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
    });

module.exports = {
  pool,
};

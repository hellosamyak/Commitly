import dotenv from "dotenv";
import { pool } from "../src/db/pool.js";
import { runMigrations } from "../src/db/migrate.js";

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing in server/.env");
  process.exit(1);
}

try {
  await runMigrations();
  console.log("Migration completed successfully.");
} catch (err) {
  console.error("Migration failed:", err.message);
  if (err.code === "3D000") {
    console.error(
      "Database does not exist. Create it first (pgAdmin or: createdb -U postgres productivity_contributions)"
    );
  }
  process.exitCode = 1;
} finally {
  await pool.end();
}

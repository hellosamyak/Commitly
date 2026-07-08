import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./pool.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationPath = path.join(__dirname, "migrations/001_init.sql");

export async function runMigrations() {
  const sql = fs.readFileSync(migrationPath, "utf8");
  await pool.query(sql);
}

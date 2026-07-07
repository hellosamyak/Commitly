import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationPath = path.join(__dirname, "../src/db/migrations/001_init.sql");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is missing in server/.env");
  process.exit(1);
}

const sql = fs.readFileSync(migrationPath, "utf8");

const client = new pg.Client({ connectionString: databaseUrl });

try {
  await client.connect();
  await client.query(sql);
  console.log("Migration completed successfully.");
} catch (err) {
  console.error("Migration failed:", err.message);
  if (err.code === "3D000") {
    console.error(
      'Database does not exist. Create it first (pgAdmin or: createdb -U postgres productivity_contributions)'
    );
  }
  process.exit(1);
} finally {
  await client.end();
}

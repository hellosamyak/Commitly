import app from "./app.js";
import { env } from "./config/env.js";
import { runMigrations } from "./db/migrate.js";

try {
  await runMigrations();
  console.log("Database migrations are up to date.");

  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });
} catch (err) {
  console.error("Failed to prepare database:", err);
  process.exit(1);
}


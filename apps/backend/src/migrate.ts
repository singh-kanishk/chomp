import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "./logger/logger.js";
import { GetEnv } from "./lib/envReader.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  const env = new GetEnv();
  let dbUrl: string | undefined;

  try {
    dbUrl = await env.getDatabaseUrl();
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(
      { error },
      `DATABASE_URL not found in environment or AWS SSM (${errorMsg}). Cannot run migrations.`,
    );
    process.exit(1);
  }

  if (!dbUrl) {
    logger.error("DATABASE_URL is empty. Cannot run migrations.");
    process.exit(1);
  }

  const isProduction = process.env.NODE_ENV === "production";
  const isRds = dbUrl.includes("rds.amazonaws.com");
  const ssl = isRds || isProduction ? { rejectUnauthorized: false } : undefined;

  logger.info("Connecting to database for migrations...");
  const sql = postgres(dbUrl, {
    max: 1,
    ...(ssl ? { ssl } : {}),
  });
  const db = drizzle(sql);

  // Path to the drizzle migrations folder
  const migrationsFolder = path.resolve(__dirname, "../drizzle");

  try {
    logger.info(`Running migrations from ${migrationsFolder}...`);
    await migrate(db, { migrationsFolder });
    logger.info("Migrations completed successfully!");
  } catch (error) {
    logger.error({ error }, "Migration failed");
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Execute migration if invoked directly
runMigrations();

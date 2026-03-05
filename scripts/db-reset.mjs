import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = postgres(connectionString);

try {
  console.log("Resetting PostgreSQL schema...");
  await sql`DROP SCHEMA IF EXISTS public CASCADE`;
  await sql`CREATE SCHEMA public`;
  console.log("Database schema reset complete.");
} catch (error) {
  console.error("Failed to reset database schema:");
  console.error(error);
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}

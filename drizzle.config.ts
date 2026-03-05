import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/utils/schema.ts",
  out: "./server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

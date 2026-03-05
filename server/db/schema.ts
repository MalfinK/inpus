import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ─── Members ─────────────────────────────────────────────────────────────────
export const members = sqliteTable("members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  nimNip: text("nim_nip"),
  type: text("type", { enum: ["intern", "pkl", "pegawai"] })
    .notNull()
    .default("intern"),
  division: text("division"),
  phone: text("phone"),
  institution: text("institution"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  createdAt: text("created_at")
    .default(sql`(datetime('now','localtime'))`)
    .notNull(),
});

// ─── Projects ────────────────────────────────────────────────────────────────
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  memberId: integer("member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  roles: text("roles").notNull().default("[]"), // JSON array: ['frontend','backend','ui-ux']
  status: text("status", { enum: ["active", "completed", "on-hold"] })
    .notNull()
    .default("active"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  createdAt: text("created_at")
    .default(sql`(datetime('now','localtime'))`)
    .notNull(),
});

// ─── Tasks ───────────────────────────────────────────────────────────────────
export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  memberId: integer("member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  weekStart: text("week_start").notNull(), // ISO date string
  weekEnd: text("week_end").notNull(),
  status: text("status", { enum: ["pending", "terealisasi", "hutang"] })
    .notNull()
    .default("pending"),
  adminNote: text("admin_note"),
  markedAt: text("marked_at"),
  createdAt: text("created_at")
    .default(sql`(datetime('now','localtime'))`)
    .notNull(),
});

// ─── Type exports ─────────────────────────────────────────────────────────────
export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

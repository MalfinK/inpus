import { pgTable, text, integer, serial, timestamp } from "drizzle-orm/pg-core";

// ─── Members ─────────────────────────────────────────────────────────────────
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nimNip: text("nim_nip"),
  type: text("type")
    .$type<"intern" | "pkl" | "pegawai">()
    .notNull()
    .default("intern"),
  division: text("division"),
  phone: text("phone"),
  institution: text("institution"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Projects ────────────────────────────────────────────────────────────────
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  roles: text("roles").notNull().default("[]"), // JSON array: ['frontend','backend','ui-ux']
  status: text("status")
    .$type<"active" | "completed" | "on-hold">()
    .notNull()
    .default("active"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Tasks ───────────────────────────────────────────────────────────────────
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  memberId: integer("member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  weekStart: text("week_start").notNull(),
  weekEnd: text("week_end").notNull(),
  status: text("status")
    .$type<"pending" | "terealisasi" | "hutang">()
    .notNull()
    .default("pending"),
  adminNote: text("admin_note"),
  markedAt: text("marked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Type exports ─────────────────────────────────────────────────────────────
export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

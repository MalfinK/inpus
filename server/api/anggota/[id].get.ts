import { db } from "../../utils/db";
import { members, projects, tasks } from "../../utils/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  if (!id) throw createError({ statusCode: 400, message: "ID tidak valid" });

  const [member] = await db.select().from(members).where(eq(members.id, id));
  if (!member)
    throw createError({ statusCode: 404, message: "Anggota tidak ditemukan" });

  const memberProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.memberId, id));
  const memberTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.memberId, id));

  return {
    ...member,
    projects: memberProjects.map((p) => ({
      ...p,
      roles: JSON.parse(p.roles || "[]"),
    })),
    tasks: memberTasks,
  };
});

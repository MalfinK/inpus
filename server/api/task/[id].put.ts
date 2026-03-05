import { db } from "../../utils/db";
import { tasks } from "../../utils/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  if (!id) throw createError({ statusCode: 400, message: "ID tidak valid" });

  const body = (await readBody(event)) as {
    status?: "pending" | "terealisasi" | "hutang";
    adminNote?: string | null;
    title?: string;
    description?: string | null;
    weekStart?: string;
    weekEnd?: string;
    projectId?: number;
  };

  // Status path: pending/terealisasi can be set by anyone, but hutang + adminNote are admin-only.
  if (body.status !== undefined || body.adminNote !== undefined) {
    const allowedStatus = ["pending", "terealisasi", "hutang"];
    if (body.status && !allowedStatus.includes(body.status)) {
      throw createError({ statusCode: 400, message: "Status tidak valid" });
    }

    if (body.status === "hutang" || body.adminNote !== undefined) {
      await requireAdmin(event);
    }

    const [updated] = await db
      .update(tasks)
      .set({
        status: body.status,
        adminNote: body.adminNote ?? null,
        markedAt: body.status !== "pending" ? new Date().toISOString() : null,
      })
      .where(eq(tasks.id, id))
      .returning();

    if (!updated)
      throw createError({ statusCode: 404, message: "Task tidak ditemukan" });
    return updated;
  }

  // Public/member path for editing task details.
  if (!body.title?.trim() || !body.weekStart || !body.weekEnd) {
    throw createError({ statusCode: 400, message: "Data task tidak lengkap" });
  }

  const [updated] = await db
    .update(tasks)
    .set({
      title: body.title.trim(),
      description: body.description ?? null,
      weekStart: body.weekStart,
      weekEnd: body.weekEnd,
      projectId: body.projectId ? Number(body.projectId) : undefined,
    })
    .where(eq(tasks.id, id))
    .returning();

  if (!updated)
    throw createError({ statusCode: 404, message: "Task tidak ditemukan" });
  return updated;
});

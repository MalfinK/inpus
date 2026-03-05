import { db } from "../../utils/db";
import { projects } from "../../utils/schema";
import { eq } from "drizzle-orm";
import type { NewProject } from "../../utils/schema";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  if (!id) throw createError({ statusCode: 400, message: "ID tidak valid" });

  const body = (await readBody(event)) as Partial<NewProject> & {
    roles?: string[];
  };

  const [updated] = await db
    .update(projects)
    .set({
      name: body.name,
      description: body.description ?? null,
      roles: JSON.stringify(body.roles || []),
      status: body.status,
      startDate: body.startDate ?? null,
      endDate: body.endDate ?? null,
    })
    .where(eq(projects.id, id))
    .returning();

  if (!updated)
    throw createError({ statusCode: 404, message: "Proyek tidak ditemukan" });
  return { ...updated, roles: JSON.parse(updated.roles || "[]") };
});

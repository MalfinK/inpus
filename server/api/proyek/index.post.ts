import { db } from "../../utils/db";
import { projects } from "../../utils/schema";
import type { NewProject } from "../../utils/schema";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as Partial<NewProject> & {
    roles?: string[];
  };

  if (!body.memberId || !body.name?.trim()) {
    throw createError({
      statusCode: 400,
      message: "Member ID dan nama proyek wajib diisi",
    });
  }

  const [project] = await db
    .insert(projects)
    .values({
      memberId: Number(body.memberId),
      name: body.name.trim(),
      description: body.description || null,
      roles: JSON.stringify(body.roles || []),
      status: body.status || "active",
      startDate: body.startDate || null,
      endDate: body.endDate || null,
    })
    .returning();

  return { ...project, roles: JSON.parse(project.roles || "[]") };
});

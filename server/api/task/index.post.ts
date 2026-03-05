import { db } from "../../utils/db";
import { tasks } from "../../utils/schema";
import type { NewTask } from "../../utils/schema";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as Partial<NewTask>;

  if (
    !body.projectId ||
    !body.memberId ||
    !body.title?.trim() ||
    !body.weekStart ||
    !body.weekEnd
  ) {
    throw createError({
      statusCode: 400,
      message: "Project ID, member ID, judul, dan minggu wajib diisi",
    });
  }

  const [task] = await db
    .insert(tasks)
    .values({
      projectId: Number(body.projectId),
      memberId: Number(body.memberId),
      title: body.title.trim(),
      description: body.description || null,
      weekStart: body.weekStart,
      weekEnd: body.weekEnd,
      status: "pending",
    })
    .returning();

  return task;
});

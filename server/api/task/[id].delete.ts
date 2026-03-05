import { db } from "../../utils/db";
import { tasks } from "../../utils/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  if (!id) throw createError({ statusCode: 400, message: "ID tidak valid" });

  await db.delete(tasks).where(eq(tasks.id, id));
  return { success: true };
});

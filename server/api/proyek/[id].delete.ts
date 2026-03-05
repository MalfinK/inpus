import { db } from "../../utils/db";
import { projects } from "../../utils/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  if (!id) throw createError({ statusCode: 400, message: "ID tidak valid" });

  await db.delete(projects).where(eq(projects.id, id));
  return { success: true };
});

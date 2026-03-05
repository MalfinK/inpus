import { db } from "../../utils/db";
import { members } from "../../utils/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = Number(getRouterParam(event, "id"));
  if (!id) throw createError({ statusCode: 400, message: "ID tidak valid" });

  await db.delete(members).where(eq(members.id, id));
  return { success: true };
});

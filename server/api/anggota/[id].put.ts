import { db } from "../../utils/db";
import { members } from "../../utils/schema";
import { eq } from "drizzle-orm";
import type { NewMember } from "../../utils/schema";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = Number(getRouterParam(event, "id"));
  if (!id) throw createError({ statusCode: 400, message: "ID tidak valid" });

  const body = (await readBody(event)) as Partial<NewMember>;

  const [updated] = await db
    .update(members)
    .set({
      name: body.name,
      nimNip: body.nimNip ?? null,
      type: body.type,
      division: body.division ?? null,
      phone: body.phone ?? null,
      institution: body.institution ?? null,
      startDate: body.startDate ?? null,
      endDate: body.endDate ?? null,
    })
    .where(eq(members.id, id))
    .returning();

  if (!updated)
    throw createError({ statusCode: 404, message: "Anggota tidak ditemukan" });
  return updated;
});

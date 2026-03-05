import { db } from "../../utils/db";
import { members } from "../../utils/schema";
import type { NewMember } from "../../utils/schema";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const body = (await readBody(event)) as Partial<NewMember>;

  if (!body.name?.trim()) {
    throw createError({ statusCode: 400, message: "Nama wajib diisi" });
  }

  const [member] = await db
    .insert(members)
    .values({
      name: body.name.trim(),
      nimNip: body.nimNip || null,
      type: body.type || "intern",
      division: body.division || null,
      phone: body.phone || null,
      institution: body.institution || null,
      startDate: body.startDate || null,
      endDate: body.endDate || null,
    })
    .returning();

  return member;
});

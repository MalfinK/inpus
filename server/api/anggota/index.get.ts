import { db } from "../../utils/db";
import { members } from "../../utils/schema";
import { asc } from "drizzle-orm";

export default defineEventHandler(async () => {
  return db.select().from(members).orderBy(asc(members.name));
});

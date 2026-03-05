import { db } from "../../utils/db";
import { projects, members } from "../../utils/schema";
import { eq, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const memberId = query.memberId ? Number(query.memberId) : null;

  let rows;

  if (memberId) {
    rows = await db
      .select()
      .from(projects)
      .where(eq(projects.memberId, memberId))
      .orderBy(desc(projects.createdAt));
  } else {
    rows = await db
      .select({
        project: projects,
        memberName: members.name,
      })
      .from(projects)
      .leftJoin(members, eq(projects.memberId, members.id))
      .orderBy(desc(projects.createdAt));
  }

  return rows.map((r) => {
    if ("project" in r) {
      return {
        ...r.project,
        roles: JSON.parse(r.project.roles || "[]"),
        memberName: r.memberName,
      };
    }
    return {
      ...r,
      roles: JSON.parse((r as typeof projects.$inferSelect).roles || "[]"),
    };
  });
});

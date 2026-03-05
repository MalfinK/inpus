import { db } from "../../utils/db";
import { tasks, projects, members } from "../../utils/schema";
import { eq, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const memberId = query.memberId ? Number(query.memberId) : null;
  const projectId = query.projectId ? Number(query.projectId) : null;

  if (projectId) {
    return db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(desc(tasks.createdAt));
  }

  if (memberId) {
    return db
      .select()
      .from(tasks)
      .where(eq(tasks.memberId, memberId))
      .orderBy(desc(tasks.createdAt));
  }

  // Return all tasks with member and project info
  return db
    .select({
      task: tasks,
      memberName: members.name,
      projectName: projects.name,
    })
    .from(tasks)
    .leftJoin(members, eq(tasks.memberId, members.id))
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .orderBy(desc(tasks.createdAt))
    .then((rows) =>
      rows.map((r) => ({
        ...r.task,
        memberName: r.memberName,
        projectName: r.projectName,
      })),
    );
});

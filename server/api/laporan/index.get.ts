import { db } from "../../utils/db";
import { members, projects, tasks } from "../../utils/schema";
import { eq, count, sql } from "drizzle-orm";

export default defineEventHandler(async () => {
  const allMembers = await db.select().from(members);

  const projectStats = await db
    .select({
      memberId: projects.memberId,
      total: count(projects.id),
      completed: sql<number>`SUM(CASE WHEN ${projects.status} = 'completed' THEN 1 ELSE 0 END)`,
      active: sql<number>`SUM(CASE WHEN ${projects.status} = 'active' THEN 1 ELSE 0 END)`,
      onHold: sql<number>`SUM(CASE WHEN ${projects.status} = 'on-hold' THEN 1 ELSE 0 END)`,
    })
    .from(projects)
    .groupBy(projects.memberId);

  const taskStats = await db
    .select({
      memberId: tasks.memberId,
      total: count(tasks.id),
      terealisasi: sql<number>`SUM(CASE WHEN ${tasks.status} = 'terealisasi' THEN 1 ELSE 0 END)`,
      hutang: sql<number>`SUM(CASE WHEN ${tasks.status} = 'hutang' THEN 1 ELSE 0 END)`,
      pending: sql<number>`SUM(CASE WHEN ${tasks.status} = 'pending' THEN 1 ELSE 0 END)`,
    })
    .from(tasks)
    .groupBy(tasks.memberId);

  const allProjects = await db.select().from(projects);

  // Aggregate roles distribution
  const roleCount: Record<string, number> = {
    frontend: 0,
    backend: 0,
    "ui-ux": 0,
    tl: 0,
    sa: 0,
  };
  for (const p of allProjects) {
    const roles: string[] = JSON.parse(p.roles || "[]");
    for (const r of roles) {
      if (r in roleCount) roleCount[r]++;
    }
  }

  // Build per-member result
  const result = allMembers.map((m) => {
    const ps = projectStats.find((s) => s.memberId === m.id) || {
      total: 0,
      completed: 0,
      active: 0,
      onHold: 0,
    };
    const ts = taskStats.find((s) => s.memberId === m.id) || {
      total: 0,
      terealisasi: 0,
      hutang: 0,
      pending: 0,
    };
    return {
      member: m,
      projects: {
        total: ps.total,
        completed: ps.completed,
        active: ps.active,
        onHold: ps.onHold,
      },
      tasks: {
        total: ts.total,
        terealisasi: ts.terealisasi,
        hutang: ts.hutang,
        pending: ts.pending,
      },
    };
  });

  return {
    members: result,
    roles: roleCount,
    totals: {
      members: allMembers.length,
      projects: allProjects.length,
      tasks: taskStats.reduce((sum, t) => sum + t.total, 0),
      terealisasi: taskStats.reduce((sum, t) => sum + (t.terealisasi || 0), 0),
      hutang: taskStats.reduce((sum, t) => sum + (t.hutang || 0), 0),
      pending: taskStats.reduce((sum, t) => sum + (t.pending || 0), 0),
    },
  };
});

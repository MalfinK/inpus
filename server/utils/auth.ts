import type { H3Event } from "h3";

export async function requireAdmin(event: H3Event) {
  const session = await getUserSession(event);
  if (!session?.user?.role || session.user.role !== "admin") {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  return session;
}

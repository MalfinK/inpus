export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const body = await readBody(event);

  if (!body?.username || !body?.password) {
    throw createError({
      statusCode: 400,
      message: "Username dan password wajib diisi",
    });
  }

  if (
    body.username !== config.adminUsername ||
    body.password !== config.adminPassword
  ) {
    throw createError({
      statusCode: 401,
      message: "Username atau password salah",
    });
  }

  await setUserSession(event, {
    user: {
      username: body.username,
      role: "admin",
    },
  });

  return { success: true };
});

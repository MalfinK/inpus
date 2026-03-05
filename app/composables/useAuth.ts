export const useAuth = () => {
  const { loggedIn, user, fetch: fetchSession, clear } = useUserSession();

  const login = async (username: string, password: string) => {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: { username, password },
    });
    await fetchSession();
  };

  const logout = async () => {
    await $fetch("/api/auth/logout", { method: "POST" });
    await clear();
    await navigateTo("/login");
  };

  const isAdmin = computed(
    () => loggedIn.value && (user.value as any)?.role === "admin",
  );

  return { loggedIn, user, isAdmin, login, logout };
};

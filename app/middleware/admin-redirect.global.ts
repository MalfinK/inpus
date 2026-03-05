// Redirect /admin -> /admin/dashboard
export default defineNuxtRouteMiddleware((to) => {
  if (to.path === "/admin" || to.path === "/admin/") {
    return navigateTo("/admin/dashboard");
  }
});

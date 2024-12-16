export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCookie("user");
  const token = useCookie("token");
  if (to.path === "/login") {
    return;
  }

  if (!user.value || !token.value) {
    return navigateTo("/login");
  }
});

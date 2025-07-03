import useUser from "~/composables/useUser";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, hasAuthResolved, authPromise } = useUser();

  if (!hasAuthResolved.value) {
    await authPromise;
  }

  if (to.path === "/auth" && user.value) {
    return navigateTo("/");
  }

  const protectedRoutes = ["/favorites"];
  if (
    protectedRoutes.some((route) => to.path.startsWith(route)) &&
    !user.value
  ) {
    return navigateTo("/auth");
  }
});

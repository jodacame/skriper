export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();

  const user = {
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 90, // 90 days
    },
    isLogged() {
      const user = this.get();
      return user.value ? true : false;
    },
    data() {
      return this.get().value;
    },
    get() {
      return useCookie("user", this.cookieOptions);
    },
    set(value) {
      this.get().value = value;
    },
    token: {
      get() {
        const token = useCookie("token", user.cookieOptions);
        return token.value ? token.value : null;
      },
      set(value) {
        useCookie("token", user.cookieOptions).value = value;
      },
    },

    logout() {
      user.set(null);
      user.token.set(null);
    },
    async refresh() {
      const response = await nuxtApp.$api.get("/user/me");
      if (response) {
        if (response.user) {
          this.set(response.user);
        }
        if (response.token) {
          this.token.set(response.token);
        }
      }
      return response;
    },
  };
  nuxtApp.provide("user", user);
});

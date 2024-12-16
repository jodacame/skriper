export default defineNuxtPlugin((nuxtApp) => {
  const Alert = {
    show({ title, text, type }) {
      // native for now
      alert(`${title}\n${text}`);
    },
  };

  nuxtApp.provide("alert", Alert);
});

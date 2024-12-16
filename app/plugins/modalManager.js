export default defineNuxtPlugin((nuxtApp) => {
  const modalManager = reactive({
    stack: [],

    register(modalRef) {
      this.stack.push(modalRef); // Agrega el modal al tope de la pila
    },

    unregister(modalRef) {
      const index = this.stack.indexOf(modalRef);
      if (index !== -1) {
        this.stack.splice(index, 1); // Elimina el modal de la pila
      }
    },

    getTop() {
      return this.stack[this.stack.length - 1]; // Retorna el modal en el tope
    },
  });

  nuxtApp.provide("modalManager", modalManager);
});

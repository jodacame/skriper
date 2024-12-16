import mitt from 'mitt'


export default defineNuxtPlugin((nuxtApp) => {
    const emitter = mitt()

    const Events = {
        emit: emitter.emit,
        on: emitter.on
    };

    nuxtApp.provide("events", Events);
});

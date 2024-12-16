import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

export default defineNuxtPlugin((nuxtApp) => {
    const Toast = {
        TYPES: {
            INFO: 'rgba(var(--v-info))',
            SUCCESS: 'rgba(var(--v-success))',
            WARNING: 'rgba(var(--v-warning))',
            ERROR: 'rgba(var(--v-danger))',
            DANGER: 'rgba(var(--v-danger))',
        },
        success(text, options) {
            return this.show({ text, type: 'SUCCESS', ...options });
        },
        error(text, options) {
            return this.show({ text, type: 'ERROR', ...options });
        },
        warning(text, options) {
            return this.show({ text, type: 'WARNING', ...options });
        },
        info(text, options) {
            return this.show({ text, type: 'INFO', ...options });
        },

        show({ text, type = 'info', duration = 3000, destination, newWindow = true, close = true, gravity = "top", position = "right", stopOnFocus = true }) {
            return new Promise((resolve) => {
                Toastify({
                    text,
                    duration,
                    destination,
                    newWindow,
                    close,
                    gravity,
                    position,
                    stopOnFocus,
                    style: {
                        background: this.TYPES[type],
                        color: "#fff",
                    },
                    onClick: function () {
                        resolve('CLICKED');
                    },
                    callback: function () {
                        resolve('CLOSED');
                    }
                }).showToast();
            });
        },
    };

    nuxtApp.provide("toast", Toast);
});

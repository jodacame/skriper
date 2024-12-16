import cronstrue from 'cronstrue';

export default defineNuxtPlugin(async (nuxtApp) => {
  const Utils = {
    /** Animate: Smooth scroll */
    scroll: {
      toTop(elm = null, animated = true) {
        if (elm && typeof elm === 'string') {
          elm = document.querySelector(elm);
        }
        if (elm) {
          elm.scrollTo({
            top: 0,
            behavior: animated ? "smooth" : "auto",
          });
        } else {
          window.scrollTo({
            top: 0,
            behavior: animated ? "smooth" : "auto",
          });
        }
      },
      toBottom(elm = null, animated = true) {
        if (elm && typeof elm === 'string') {
          elm = document.querySelector(elm);
        }
        if (elm) {
          elm.scrollTo({
            top: elm.scrollHeight,
            behavior: animated ? "smooth" : "auto",
          });
        } else {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: animated ? "smooth" : "auto",
          });
        }
      },

    },
    async copyToClipboard(text) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
          .then(() => console.log("Text copied to clipboard"))
          .catch(err => console.error("Failed to copy text: ", err));
      } else {
        // Fallback to older method using document.execCommand (less ideal)
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        console.log("Text copied to clipboard using fallback method.");
      }
    },
    cron: {
      human(cron) {
        if (!cron) return "";
        try {
          return cronstrue.toString(cron);
        } catch (e) {
          return "Not a valid cron expression";
        }
      },

    },
    date: {
      format(date, includeTime = false, includeSeconds = false) {
        const options = {
          year: "numeric",
          month: "short",
          day: "numeric",
        };
        if (includeTime) {
          options.hour = "numeric";
          options.minute = "numeric";
        }
        if (includeSeconds) {
          options.second = "numeric";
        }
        return new Date(date).toLocaleDateString("en-US", options);
      },
    },
    bytes: {
      toSize(bytes, decimals = 2) {
        if (bytes === 0 || typeof bytes === undefined || bytes === null) return "0 Byte";
        if (bytes === -1) return "Unlimited";
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

        // const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
        // return `${Math.round(bytes / 1024 ** i, 2)} ${sizes[i]}`;

        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(decimals))} ${sizes[i]}`;
      },
      format(bytes, decimals = 2) {
        return this.toSize(bytes, decimals);
      },
    },
    link: {
      open(url) {
        window.open(url, "_blank");
      }
    },
    string: {
      random(length = 8) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
          result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return result;
      },
      removeAnsiCodes(log) {
        return log.replace(/\x1b\[[0-9;]*m/g, "");
      },
    },
    number: {
      format(number, decimals = 0) {
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(number);
      }
    }
  };

  nuxtApp.provide("utils", Utils);
});

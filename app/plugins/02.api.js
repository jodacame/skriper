
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const defaultUrl = config.public.API_URL;

  const api = {
    getEndPoint() {
      return defaultUrl;
    },
    catchError(error) {
      console.error("Error", error);
      if (typeof nuxtApp.$toast === "undefined") return;
      if (error.error) {
        nuxtApp.$toast.error(error.error);
      }
      if (error && error.redirect) {
        navigateTo(error.redirect);
      }
    },
    catchResponse(output) {
      if (output && output.error) {
        return this.catchError(output);
      }
      if (output && output.message && output.message.type && typeof nuxtApp.$toast !== "undefined") {
        nuxtApp.$toast.show({
          title: output.message.title || "",
          text: output.message.text || "",
          type: output.message.type,
        });
      }

      if (output && output.redirect) {
        navigateTo(output.redirect);
      }

      // Keep the promise chain
      return new Promise((resolve) => {
        resolve(output);
      });
    },
    getToken() {
      const user = nuxtApp.$user.get();
      const token = nuxtApp.$user.token.get();
      return token;
    },

    async get(url, options = {}) {
      try {
        const response = await fetch(`${defaultUrl}${url}`, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.getToken(),
            ...options.headers,
          },
        });
        const output = await response.json();
        return this.catchResponse(output);
      } catch (error) {
        this.catchError(error);
      }
    },
    /**
     * GET request to the API (SSR compatible)
     * @param {string} url The URL to send the request
     * @param {object} options The fetch options
     * @returns {Promise} The fetch promise
     */
    async sget(url, options = {}) {
      try {
        const { data } = await useFetch(`${defaultUrl}${url}`, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.getToken(),
            ...options.headers,
          },
        });

        const output = data.value;
        return this.catchResponse(output);
      } catch (error) {
        this.catchError(error);
      }
    },
    async post(url, data, options = {}) {
      try {
        const response = await fetch(`${defaultUrl}${url}`, {
          ...options,
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.getToken(),
            ...options.headers,
          },
        });
        const output = await response.json();
        return this.catchResponse(output);
      } catch (error) {
        this.catchError(error);
      }
    },

    async postWhitStream(url, data, options = {}, callback) {
      return new Promise(async (resolve, reject) => {
        let responseString = "";
        try {
          const response = await fetch(`${defaultUrl}${url}`, {
            ...options,
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
              "accept": "application/json",
              "x-access-token": this.getToken(),
              ...options.headers,
            },
          });

          const reader = response.body.getReader();
          const stream = new ReadableStream({
            start(controller) {
              function push() {
                reader.read().then(({ done, value }) => {
                  if (done) {
                    controller.close();
                    resolve(responseString);
                    return;
                  }
                  responseString += new TextDecoder().decode(value);
                  if (callback) {
                    callback(responseString);
                  }
                  push();
                });
              }
              push();
            },
          });
          return new Response(stream);

        } catch (error) {
          this.catchError(error);
          reject(error);
        }
      });
    },

    async put(url, data, options = {}) {
      try {
        const response = await fetch(`${defaultUrl}${url}`, {
          ...options,
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.getToken(),
            ...options.headers,
          },
        });
        const output = await response.json();
        return this.catchResponse(output);
      } catch (error) {
        this.catchError(error);
      }
    },
    async delete(url, options = {}) {
      return this.del(url, options);
    },
    async del(url, options = {}) {
      try {
        const response = await fetch(`${defaultUrl}${url}`, {
          ...options,
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.getToken(),
            ...options.headers,
          },
        });
        const output = await response.json();
        return this.catchResponse(output);
      } catch (error) {
        this.catchError(error);
      }
    },
  };

  nuxtApp.provide("api", api);
});

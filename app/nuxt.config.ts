import { version } from './package.json';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/utils.css', '~/assets/css/app.css'],
  components: true,
  runtimeConfig: {
    public: {
      VERSION: version,
      API_URL: process.env.API_URL,
    },
  },
  modules: [
    '@vite-pwa/nuxt',
  ],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Skriper - Assistant',
      short_name: 'Skriper',
      description: 'A simple AI Chat Assistant',
      theme_color: '#448AFF',
      background_color: '#448AFF',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: 'icon.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icon.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      // Workbox options for caching strategies.
    },
    devOptions: {
      enabled: false, // Enable PWA in development mode
      type: 'module',
    },
  },
})

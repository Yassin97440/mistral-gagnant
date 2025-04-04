import { transformAssetUrls } from 'vite-plugin-vuetify'


export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    'vuetify-nuxt-module',
    '@nuxtjs/tailwindcss'
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  runtimeConfig: {
    mistralApiKey: process.env.MISTRAL_API_KEY
  }
})
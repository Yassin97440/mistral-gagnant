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

  tailwindcss: {
    cssPath: '~/app/assets/css/tailwind.css',
    configPath: '~/tailwind.config.ts',
    exposeConfig: true,
    viewer: true,
  },

  vuetify: {
    moduleOptions: {
      /* Module specific options */
    },
    vuetifyOptions: {
      /* Vuetify options */
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              primary: '#00DC82',
              secondary: '#14532d',
              'user-bg': '#EBF5FF',
              'assistant-bg': '#F5FFF9',
              'interface-bg': '#020618'
            }
          }
        }
      }
    }
  },

  runtimeConfig: {
    mistralApiKey: process.env.MISTRAL_API_KEY,
    huggingFaceApiToken: process.env.HUGGING_FACE_API_KEY
  }
})
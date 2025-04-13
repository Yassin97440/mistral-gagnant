import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app/**/*.{js,vue,ts}'
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs principales
        primary: '#00DC82',
        secondary: '#284237',
        'user-bg': '#279C6B',
        'assistant-bg': '#2E5C49',
        'interface-bg': '#020618'
      },
      borderRadius: {
        'message': '12px'
      },
      spacing: {
        'chat-input': '150px'
      }
    }
  },
  plugins: [],
  // Assurer la compatibilité avec Vuetify
  corePlugins: {
    preflight: false
  }
} 
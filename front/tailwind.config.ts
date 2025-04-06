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
        primary: '#1976D2',
        secondary: '#14532d',
        // Couleurs pour les messages
        'user-bg': '#EBF5FF',
        'assistant-bg': '#F5FFF9',
        'interface-bg': '#FFFFFF'
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
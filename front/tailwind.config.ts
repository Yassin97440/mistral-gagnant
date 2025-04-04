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
        // Couleurs principales basées sur les composants existants
        primary: {
          DEFAULT: '#1976D2', // Couleur primaire de Vuetify
          dark: '#1565C0',
          light: '#42A5F5'
        },
        secondary: {
          DEFAULT: '#9C27B0',
          dark: '#7B1FA2',
          light: '#BA68C8'
        },
        // Couleurs pour les messages
        user: {
          DEFAULT: '#1976D2', // Même que primary
          dark: '#1565C0',
          background: '#E3F2FD'
        },
        assistant: {
          DEFAULT: '#616161',
          dark: '#424242',
          background: '#F5F5F5' // gray-lighten-4 dans Vuetify
        },
        // Couleurs d'interface
        interface: {
          border: 'rgba(0, 0, 0, 0.1)',
          background: '#FFFFFF'
        }
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
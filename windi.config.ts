import { defineConfig } from 'windicss/helpers'
import scrollSnapPlugin from 'windicss/plugin/scroll-snap'

export default defineConfig({
  attributify: true,
  theme: {
    extend: {
      dropShadow: {
        'ea1': '0 6px 1px rgba(32, 32, 32, 0.1)',
        '4xl': 'drop-shadow(0 40px 40px rgba(0, 0, 0, 0.3))',
        'alice': '0 3px 3px rgba(0, 0, 0, 20%)'
      },

      fontSize: {
        'normal': ['15px', '27px'],
        'large': ['20px', '28px'],
      },

      boxShadow: {
        'inner1': 'inset 4px 4px 4px 0 rgba(0, 0, 0, 0.6)',
      },
      color: {
        'eablue': '#7A99D8'
      },
      backgroundPosition: {
        'right-70': '70%',
      }
    },
    
  },
  plugins: [
    require('windicss/plugin/aspect-ratio'),
    scrollSnapPlugin
  ],
})
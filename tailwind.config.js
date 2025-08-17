/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  darkMode: 'class',
  content: [
    './src/components/**/*.{js,jsx}',
    './src/App.js'
  ],
  theme: {
    extend: {
      screens: {
        'amd': '777px',
        'gmob-lsm': {'min': '500px', 'max': '640px'},
        'xs-md': {'min': '0px', 'max': '768px'},
        'nmob': '400px',
      },
      fontFamily: {
        'russo': ['Russo One', 'sans-serif'],
        'spartan': ['League Spartan', 'sans-serif'],
        'barlow': ['Barlow', 'sans-serif'],
        'comic-relief': ["Comic Relief", "system-ui"],
        'bangers': ['Bangers', 'system-ui'],
      }
    },
  },
  plugins: [],
}

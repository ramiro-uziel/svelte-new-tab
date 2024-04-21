/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'newtab': '#171717',
      },
      fontFamily: {
        Bitter: ["Bitter", "serif"],
      },
    },
  },
  plugins: []
};
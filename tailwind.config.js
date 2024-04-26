/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'newtab': '#171717',
        'light-blue': '#c1f4ff'
      },
      fontFamily: {
        Bitter: ["Bitter", "serif"],
      },
    },
  },
  safelist: [
    {
      pattern: /grid-cols-./,
    }
  ],
  plugins: []
};
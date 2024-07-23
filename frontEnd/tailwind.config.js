const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content()
  ],
  darkMode: 'class', // Aggiungi questa riga
  theme: {
    extend: {
      colors: {
        Viola: '#F812BA',
        footer: '#0A0A0A'
      },
    },
  },
  plugins: [
    flowbite.plugin()
  ],
}
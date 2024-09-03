/** @type {import('tailwindcss').Config} */

export default {
  daisyui: {
    themes: ["light"],
  },
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-green": "#198754",
        "light-green": "#0AAD0A",
      },
      fontFamily: {
        Manrope: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
};

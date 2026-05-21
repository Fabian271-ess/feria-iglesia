/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
        colors: {
           hk: {
             dark: "#1a0205",
             wine: "#6b0f1a",
             "wine-deep": "#3d0008",
             crimson: "#8b0000",
             gold: "#d4a843",
             "gold-light": "#f2c96e",
             cream: "#f5e6c8",
           }
        },
        fontFamily:{
          rajdhani: ["Rajdhani", "sans-serif"],
        }
    },
  },
  plugins: [],
}


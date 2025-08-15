/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E85D04",
        secondary: "#DC2F02",
        accent: "#FFBA08",
        surface: "#FFFFFF",
        background: "#FFF3E0",
        success: "#43A047",
        warning: "#FB8C00",
        error: "#E53935",
        info: "#1976D2"
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}
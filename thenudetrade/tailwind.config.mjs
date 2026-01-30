/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#020617",
        neonPink: "#ff3ba7",
        neonPurple: "#a855f7",
        neonSoft: "#f9a8ff"
      },
      boxShadow: {
        neon: "0 0 25px rgba(255,59,167,0.55)",
        'xl-soft': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl-soft': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
};


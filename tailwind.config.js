/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af', // Blue
        secondary: '#64748b', // Slate
        accent: '#f59e0b', // Amber
        danger: '#ef4444', // Red
        success: '#10b981', // Emerald
      },
    },
  },
  plugins: [],
}
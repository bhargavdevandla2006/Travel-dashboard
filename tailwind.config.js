/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {

      // ================================
      // YOUR EXISTING FONTS
      // ================================

      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },

      // ================================
      // YOUR EXISTING COLORS
      // ================================

      colors: {
        primary: "#1e40af",
        secondary: "#64748b",
        accent: "#f59e0b",
        danger: "#ef4444",
        success: "#10b981",
      },

      // ================================
      // BOOKING PAGE ANIMATIONS
      // ================================

      keyframes: {

        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(25px)",
          },

          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        floatCard: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },

          "50%": {
            transform: "translateY(-6px)",
          },
        },

        slowZoom: {
          "0%, 100%": {
            transform: "scale(1)",
          },

          "50%": {
            transform: "scale(1.04)",
          },
        },

        priceGlow: {
          "0%, 100%": {
            boxShadow:
              "0 4px 12px rgba(249,115,22,0.10)",
          },

          "50%": {
            boxShadow:
              "0 8px 25px rgba(249,115,22,0.25)",
          },
        },

        slideInRight: {
          "0%": {
            opacity: "0",
            transform: "translateX(30px)",
          },

          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },

        slideInLeft: {
          "0%": {
            opacity: "0",
            transform: "translateX(-30px)",
          },

          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },

        softPulse: {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },

          "50%": {
            opacity: "0.75",
            transform: "scale(1.03)",
          },
        },

        buttonGlow: {
          "0%, 100%": {
            boxShadow:
              "0 8px 25px rgba(59,130,246,0.25)",
          },

          "50%": {
            boxShadow:
              "0 12px 40px rgba(59,130,246,0.45)",
          },
        },

        arrowMove: {
          "0%, 100%": {
            transform: "translateX(0)",
          },

          "50%": {
            transform: "translateX(4px)",
          },
        },

      },

      // ================================
      // ANIMATION NAMES
      // ================================

      animation: {

        fadeInUp:
          "fadeInUp 0.8s ease-out",

        floatCard:
          "floatCard 5s ease-in-out infinite",

        slowZoom:
          "slowZoom 8s ease-in-out infinite",

        priceGlow:
          "priceGlow 3s ease-in-out infinite",

        slideInRight:
          "slideInRight 0.8s ease-out",

        slideInLeft:
          "slideInLeft 0.8s ease-out",

        softPulse:
          "softPulse 2.5s ease-in-out infinite",

        buttonGlow:
          "buttonGlow 3s ease-in-out infinite",

        arrowMove:
          "arrowMove 1.5s ease-in-out infinite",

      },

    },
  },

  plugins: [],
};
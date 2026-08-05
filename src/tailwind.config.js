/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      backgroundImage: {
        hero: `
          radial-gradient(circle at top left,
          rgba(59,130,246,0.25),
          transparent 30%),
          radial-gradient(circle at bottom right,
          rgba(168,85,247,0.25),
          transparent 30%)
        `,
      },

      animation: {
        float: "float 6s ease-in-out infinite",
      },

      keyframes: {
        float: {
          "0%,100%": {
            transform: "translateY(0px)",
          },

          "50%": {
            transform: "translateY(-12px)",
          },
        },
      },
    },
  },

  plugins: [],
};
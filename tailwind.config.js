/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "spin-reverse": "spin 10s linear infinite reverse",
        float: "float 10s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        fadeIn: "fadeIn 0.3s ease-out forwards",
        completedStep: "completedStep 0.5s ease-out",
        checkmark: "checkmark 0.5s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(10px, -10px)" },
          "50%": { transform: "translate(-5px, 15px)" },
          "75%": { transform: "translate(-15px, -5px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        completedStep: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        checkmark: {
          "0%": { transform: "scale(0)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
      },
      colors: {
        primary: {
          DEFAULT: "#d8624b",
          light: "#d8624b20", // %20 opacity
          medium: "#d8624b40", // %40 opacity
          dark: "#d8624b80", // %80 opacity
        },
      },
    },
  },
  plugins: [],
};

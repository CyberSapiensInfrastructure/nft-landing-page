/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
        noise: "noise 0.5s steps(10) infinite",
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
        noise: {
          "0%, 100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-5%,-5%)" },
          "20%": { transform: "translate(-10%,5%)" },
          "30%": { transform: "translate(5%,-10%)" },
          "40%": { transform: "translate(-5%,15%)" },
          "50%": { transform: "translate(-10%,5%)" },
          "60%": { transform: "translate(15%,0)" },
          "70%": { transform: "translate(0,10%)" },
          "80%": { transform: "translate(-15%,0)" },
          "90%": { transform: "translate(10%,5%)" },
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
      fontSize: {
        'xs': '0.875rem',      // 14px (was 13px)
        'sm': '1rem',          // 16px (was 15px)
        'base': '1.125rem',    // 18px (was 17px)
        'lg': '1.25rem',       // 20px (was 19px)
        'xl': '1.375rem',      // 22px (was 21px)
        '2xl': '1.75rem',      // 28px (was 26px)
        '3xl': '2rem',         // 32px
        '4xl': '2.25rem',      // 36px
      },
      backgroundImage: {
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

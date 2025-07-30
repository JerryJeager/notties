/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./app/*.tsx", "./app/**/*.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#ffd33d",
      }
    },
  },
  plugins: [],
}
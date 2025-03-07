/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Important for dark mode toggle to work
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(220 13% 91%)",
        ring: "hsl(217.2 91.2% 59.8%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(240 10% 3.9%)",
      },
    },
  },
  plugins: [],
};

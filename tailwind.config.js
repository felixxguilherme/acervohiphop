/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          'dirty-stains': ['var(--font-dirty-stains)'],
          'scratchy': ['var(--font-scratchy)'],
          'sometype-mono': ['var(--font-sometype-mono-italic)'],
        },
        colors: {
          'dark-theme': '#312F2C',
          'dark-theme-card': '#3a3632',
          'dark-theme-accent': '#3e3936',
        },
      },
    },
    plugins: [],
  }
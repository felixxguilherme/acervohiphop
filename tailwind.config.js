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
      },
    },
    plugins: [],
  }
/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
'./*.html',
'./*.js',
],
  theme: {
    extend: {
      fontWeight: {
        DEFAULT: "300",
      },
      colors: {
        customBg: "#FCF9F8",
      },
      fontFamily: {
        sans: ['Figtree', 'serif'], 
      },
      height: {
        "256": "20rem",
      },
    },
  },
  plugins: [],
}


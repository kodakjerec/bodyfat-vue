/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      zIndex: {
        '1000': '1000',
      }
    }
  },
  plugins: [require("@tailwindcss/typography")],
};

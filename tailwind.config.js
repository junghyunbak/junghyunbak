/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      height: {
        header: "2.8125rem",
      },
      colors: {
        primary: "#5A22E0",
      },
    },
  },
  plugins: [],
};

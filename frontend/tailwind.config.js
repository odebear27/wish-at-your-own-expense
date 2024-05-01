/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        colour: {
          shadow: "#727573",
          white: "#FFFFFF",
          grey: "#9B9695",
          bluishGrey: "#b2cceb",
          darkBluishGrey: "#87a4c7",
          darkBlue: "#2e3c63",
          lightBlue: "#a6c4e5",
          tableHeader: "#E1E5EC",
        },
      },
      backgroundImage: {
        flyingSanta: "url('/src/assets/watercolour.jpg')",
      },
    },
  },
  plugins: [],
};

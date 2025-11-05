/**
 * @type {import("tailwindcss/tailwind-config").TailwindConfig}
 */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: "'Open Sans', sans-serif",
      },
      colors: {
        brand: "#6aaa64",
      },
    },
  },
  plugins: [],
};

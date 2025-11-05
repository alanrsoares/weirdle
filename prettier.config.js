module.exports = {
  importOrder: [
    "^react",
    "^next",
    "",
    "<BUILTIN_MODULES>",
    "<THIRD_PARTY_MODULES>",
    "",
    "^[~/]",
    "^[.]",
    "",
    ".css$",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  tailwindConfig: "./tailwind.config.js",
  tailwindStylesheet: "./src/styles/globals.css",
};

const tsParser = require("@typescript-eslint/parser");
const tseslint = require("@typescript-eslint/eslint-plugin");

module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: [
      "build/**",
      "node_modules/**",
      ".git/**",
      ".vscode/**",
      "build-figma-plugin.ui.js",
      "README.md",
      "package-lock.json",
      "*.config.js",
      "*.config.cjs",
      "*.config.mjs",
      ".eslintrc*",
      ".prettierrc*",
      "manifest.json",
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        figma: "readonly",
        console: "readonly",
        window: "readonly",
        document: "readonly",
        parent: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },
];

import { defineConfig } from "eslint-define-config";

export default defineConfig({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021, // Support modern ECMAScript features
    sourceType: "module", // Enable import/export syntax
    ecmaFeatures: {
      jsx: false, // Not needed for Fastify APIs
    },
    project: "./tsconfig.json", // Path to your TypeScript configuration
  },
  extends: [
    "airbnb-base",
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
  ],
  plugins: [
    "@typescript-eslint",
    "import", // Linting for import/export syntax
  ],
  env: {
    node: true, // Node.js global variables and scoping
    es2021: true, // Support ES2021 syntax
  },
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        ts: "always", // Always require .ts extensions
      },
    ],
    "no-console": "off",
    // "class-methods-use-this": "off", // Allow methods without `this` context
    // "no-underscore-dangle": "off", // Allow underscore-prefixed variables (e.g., _id)
    "@typescript-eslint/no-unused-vars": ["warn"], // Warn on unused variables
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  include: ["src/**/*"],
  exclude: ["node_modules", "dist"],
});

import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  pluginReact.configs.flat.recommended,
  tseslint.configs.recommended, // use configs.recommendedTypeChecked once other linter issues are fixed
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["*config*.js"],
    extends: [tseslint.configs.disableTypeChecked],
    rules: {
      "@typescript-eslint/no-require-imports": "off", // allow "require" in these config files
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  prettier,
]);

import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier/recommended";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  pluginReact.configs.flat.recommended,
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

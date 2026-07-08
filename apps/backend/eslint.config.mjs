import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        ignores: ["package-lock.json", "build/**", "public/headless-leaflet/vendor/**"],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { globals: globals.node },
        rules: {
            "no-useless-assignment": "off",
        },
    },
    tseslint.configs.recommended,
    {
        // Knexfiles and migrations are CommonJS: loaded by the knex CLI and by
        // `node -e "require('./knexfile.js')"`, so they legitimately use require().
        files: ["src/knexfile.js", "src/knexfileTourenDb.js", "src/migrations/**"],
        rules: {
            "@typescript-eslint/no-require-imports": "off",
        },
    },
    {
        files: ["**/*.json"],
        plugins: { json },
        language: "json/json",
        extends: ["json/recommended"],
    },
    {
        // devcontainer.json is JSONC (comments allowed) per the Dev Containers spec.
        files: [".devcontainer/**/*.json"],
        plugins: { json },
        language: "json/jsonc",
        extends: ["json/recommended"],
    },
    // NOTE: markdown linting via @eslint/markdown was removed — it is incompatible
    // with eslint 10 / @eslint/plugin-kit 0.7.x (MarkdownSourceCode.getLoc throws).
    // Prettier (`npm run format` / `format:check`) still covers markdown formatting.
    {
        files: ["**/*.test.js"],
        languageOptions: { globals: globals.jest },
    },
    {
        // headless-leaflet/map.js is a browser script loaded after Leaflet;
        // it uses browser globals (window, document) and the Leaflet global (L).
        files: ["public/headless-leaflet/map.js"],
        languageOptions: { globals: { ...globals.browser, L: "readonly" } },
    },
    eslintConfigPrettier,
]);

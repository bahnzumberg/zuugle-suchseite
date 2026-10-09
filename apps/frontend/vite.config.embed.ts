/**
 * Vite config for the embed widget build.
 *
 * Produces a single self-contained JS bundle (`zuugle-embed.js`) plus a CSS
 * file that can be loaded on any third-party page:
 *
 *   <link rel="stylesheet" href="https://www.zuugle.at/embed/zuugle-embed.css">
 *   <div id="zuugle-embed" data-lang="de" data-city="amstetten"
 *        data-api="www.zuugle.at" data-sticky-header-height="64"></div>
 *   <script src="https://www.zuugle.at/embed/zuugle-embed.js" defer></script>
 *
 * The API URL baked into the build (VITE_API_URL / `__ZUUGLE_DOMAIN__`) serves
 * as the default; it can be overridden at runtime via `data-api` on the
 * container element, so a single build works against dev / uat / prod.
 *
 * Run with: vp build --config vite.config.embed.ts
 */

import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite-plus";

/**
 * The embed talks to dev.zuugle.at for testing.
 * For production, override with VITE_API_URL=https://www.zuugle.at/api.
 */
const API_URL = process.env.VITE_API_URL?.trim() || "https://dev.zuugle.at/api";

/**
 * Asset base for the embed — on dev this is the dev server's /public path;
 * for production, set VITE_ASSET_BASE_URL=https://cdn.zuugle.at.
 */
const ASSET_BASE = (
  process.env.VITE_ASSET_BASE_URL?.trim() || "https://dev.zuugle.at/public"
).replace(/\/+$/, "");

const ASSET_BASE_TOKEN = "__ASSET_BASE__";

/** Matches a CSS module id, with or without Vite's `?used`-style suffix. */
const CSS_ID = /\.css(?:$|\?)/;

export default defineConfig({
  publicDir: false, // embed doesn't serve static assets
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    svgr(),
    // Replace __ASSET_BASE__ in CSS files
    {
      name: "zuugle-embed:asset-base-url",
      enforce: "pre",
      transform: {
        filter: { id: CSS_ID, code: ASSET_BASE_TOKEN },
        handler(code) {
          return code.replaceAll(ASSET_BASE_TOKEN, ASSET_BASE);
        },
      },
    },
  ],
  server: {
    port: 3001,
    open: "/embed.html",
    proxy: {
      "/api": {
        target: API_URL.replace(/\/api\/?$/, ""),
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "build-embed",
    assetsDir: "assets",
    lib: {
      entry: "src/embed.tsx",
      formats: ["iife"],
      name: "ZuugleEmbed",
      fileName: () => "zuugle-embed.js",
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: "zuugle-embed.[ext]",
        banner:
          "if(typeof window!=='undefined'&&!window.process){window.process={env:{NODE_ENV:'production'}}};",
      },
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env": JSON.stringify({ NODE_ENV: "production" }),
    __BUILD_HASH__: JSON.stringify(Date.now().toString(36)),
    __ASSET_BASE__: JSON.stringify(ASSET_BASE),
    // Override the API base URL for the embed — it must be absolute since
    // the widget runs on a different origin than zuugle.at.
    "import.meta.env.VITE_API_URL": JSON.stringify(API_URL),
    // Tell the API which Zuugle domain this embed represents — without this,
    // the widget would send `domain=www.bahn-zum-berg.at` (the host page)
    // and the backend wouldn't find any data.
    __ZUUGLE_DOMAIN__: JSON.stringify(new URL(API_URL).hostname),
  },
});

/**
 * Vite config for the embed widget build.
 *
 * Produces a single self-contained JS bundle (`zuugle-embed.js`) plus a CSS
 * file that can be loaded on any third-party page:
 *
 *   <link rel="stylesheet" href="https://www.zuugle.at/embed/zuugle-embed.css">
 *   <div id="zuugle-embed" data-lang="de" data-city="amstetten"></div>
 *   <script src="https://www.zuugle.at/embed/zuugle-embed.js" defer></script>
 *
 * Run with: vp build --config vite.config.embed.ts
 */

import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite-plus";

/**
 * The embed always talks to www.zuugle.at (production).
 * For dev/UAT testing, override with VITE_API_URL.
 */
const API_URL = process.env.VITE_API_URL?.trim() || "https://www.zuugle.at/api";

/**
 * Asset base for the embed — always absolute to the Zuugle CDN so fonts,
 * images, and icons load regardless of the host page's origin.
 */
const ASSET_BASE = (
  process.env.VITE_ASSET_BASE_URL?.trim() || "https://cdn.zuugle.at"
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
      },
    },
  },
  define: {
    __BUILD_HASH__: JSON.stringify(Date.now().toString(36)),
    __ASSET_BASE__: JSON.stringify(ASSET_BASE),
    // Override the API base URL for the embed — it must be absolute since
    // the widget runs on a different origin than zuugle.at.
    "import.meta.env.VITE_API_URL": JSON.stringify(API_URL),
  },
});

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

import { fileURLToPath } from "node:url";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite-plus";

const isBuild = process.argv.includes("build");

/**
 * Both URLs are baked into the bundle, so a build must state which environment
 * it targets (CI passes them, see `_deploy.yml`). Only the dev server falls
 * back to dev.zuugle.at.
 */
function requiredEnv(name: string, devDefault: string): string {
  const value = process.env[name]?.trim();
  if (value) return value;
  if (isBuild) throw new Error(`${name} must be set for the embed build`);
  return devDefault;
}

const API_URL = requiredEnv("VITE_API_URL", "https://dev.zuugle.at/api");

const ASSET_BASE = requiredEnv(
  "VITE_ASSET_BASE_URL",
  "https://dev.zuugle.at/public",
).replace(/\/+$/, "");

const ASSET_BASE_TOKEN = "__ASSET_BASE__";

/** Matches a CSS module id, with or without Vite's `?used`-style suffix. */
const CSS_ID = /\.css(?:$|\?)/;

export default defineConfig({
  publicDir: false, // embed doesn't serve static assets
  // SVGs now live outside this package (repo-root assets/), so their `react`
  // import must be pinned to this package's copy — same as vite.config.ts.
  resolve: {
    alias: {
      react: fileURLToPath(new URL("node_modules/react", import.meta.url)),
      "react-dom": fileURLToPath(
        new URL("node_modules/react-dom", import.meta.url),
      ),
    },
    dedupe: ["react", "react-dom"],
  },
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

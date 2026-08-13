/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /**
   * Base URL for static assets. `https://cdn.zuugle.at` on PROD, unset
   * everywhere else (falls back to `/public`).
   */
  readonly VITE_ASSET_BASE_URL?: string;
}

declare const __BUILD_HASH__: string;

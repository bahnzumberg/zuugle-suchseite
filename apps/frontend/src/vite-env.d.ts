/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

declare const __BUILD_HASH__: string;

/**
 * Base URL for static assets — `https://cdn.zuugle.at` on PROD, `/public`
 * everywhere else. Resolved from `VITE_ASSET_BASE_URL` in `vite.config.ts`
 * rather than read via `import.meta.env`, because HTML and CSS need the same
 * value and cannot apply the default themselves. Use `assetUrl()`, not this.
 */
declare const __ASSET_BASE__: string;

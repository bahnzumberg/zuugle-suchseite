import { fileURLToPath } from "node:url";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import sirv from "sirv";
import svgr from "vite-plugin-svgr";
import { defineConfig, type Plugin } from "vite-plus";

const uatTarget = process.env.UAT_TARGET;

/** UAT is behind basic auth; PROD is public, and sets no `UAT_AUTH`. */
const authHeaders = process.env.UAT_AUTH
  ? {
      Authorization: `Basic ${Buffer.from(process.env.UAT_AUTH).toString("base64")}`,
    }
  : undefined;

/**
 * Where a `/public` request falls back to when the file is not on disk.
 * `dev:uat` asks UAT; `dev:main` asks the host it already reads its API data
 * from (PROD); plain `vp dev` has no remote to ask and stays disk-only.
 */
const remoteAssetTarget =
  uatTarget ??
  (process.env.VITE_API_URL?.startsWith("http")
    ? new URL(process.env.VITE_API_URL).origin
    : undefined);

const BACKEND_PUBLIC_DIR = fileURLToPath(
  new URL("../backend/public", import.meta.url),
);

/**
 * Base URL of the backend `public/` folder, resolved **once** for the whole
 * build. PROD sets `VITE_ASSET_BASE_URL=https://cdn.zuugle.at`; UAT, DEV and
 * local leave it unset and serve `/public` from their own API folder.
 *
 * The default lives here rather than in `utils/assetUrl.ts` because HTML and
 * CSS cannot fall back on their own: a token that expanded to the raw, unset
 * variable would give them an empty prefix (`/fonts/…` at the site root) while
 * the app code used `/public/fonts/…`, and the font preload would then warm a
 * URL no `@font-face` ever requests.
 */
const ASSET_BASE = (
  process.env.VITE_ASSET_BASE_URL?.trim() || "/public"
).replace(/\/+$/, "");

/**
 * Warm the connection to the CDN — but only when there is one. A relative base
 * is the site's own origin, which the browser is already connected to.
 */
const ASSET_BASE_HINTS = /^https?:\/\//.test(ASSET_BASE)
  ? [
      {
        tag: "link",
        attrs: { rel: "preconnect", href: ASSET_BASE, crossorigin: true },
        injectTo: "head-prepend" as const,
      },
      {
        tag: "link",
        attrs: { rel: "dns-prefetch", href: ASSET_BASE },
        injectTo: "head-prepend" as const,
      },
    ]
  : [];

/**
 * Stands in for {@link ASSET_BASE} wherever `import.meta.env` cannot reach:
 * the `@font-face` `url()`s in `src/App.css` (Vite expands no env in CSS, and
 * `url()` cannot read a custom property) and the `index-*.html` entry points.
 * The app code gets the same value from the `__ASSET_BASE__` define below, so
 * the font preload and the `@font-face` resolve to the identical URL.
 */
const ASSET_BASE_TOKEN = "__ASSET_BASE__";

/** Matches a CSS module id, with or without Vite's `?used`-style suffix. */
const CSS_ID = /\.css(?:$|\?)/;

function assetBaseUrl(): Plugin {
  return {
    name: "zuugle:asset-base-url",
    // Before `vite:css`, which would otherwise try to resolve the unexpanded
    // `__ASSET_BASE__/fonts/…` as a relative file reference and fail the build.
    enforce: "pre",
    transform: {
      // Matched natively, so the handler is never called for the rest of the
      // module graph. The `id` half also keeps this off `.ts` sources, where
      // the same token is a JS identifier that Vite's `define` substitutes —
      // splicing a bare string in here would corrupt them.
      filter: { id: CSS_ID, code: ASSET_BASE_TOKEN },
      handler(code) {
        return code.replaceAll(ASSET_BASE_TOKEN, ASSET_BASE);
      },
    },
    transformIndexHtml(html) {
      return {
        html: html.replaceAll(ASSET_BASE_TOKEN, ASSET_BASE),
        tags: ASSET_BASE_HINTS,
      };
    },
  };
}

/**
 * Serves the backend's `public/` folder under `/public`, the way nginx aliases
 * it on every deployed environment. Reading it from disk rather than proxying
 * a local backend keeps `vp dev` usable with no API and no database, and lets
 * an asset be edited and reloaded in place.
 *
 * Registered before Vite's proxy, so a local file always wins and only what is
 * missing on disk is fetched from the remote — the generated trees
 * (`gpx-image/`, `gpx-track/`, `gpx/`, `range-image/` slugs newer than the last
 * pull) are gitignored and exist only on a deployed environment.
 */
function backendPublicAssets(): Plugin {
  return {
    name: "zuugle:backend-public-assets",
    apply: "serve",
    configureServer(server) {
      // `dev` re-reads the folder per request, so a newly added asset is picked
      // up without a restart; sirv calls next() when it finds no file.
      server.middlewares.use(
        "/public",
        sirv(BACKEND_PUBLIC_DIR, { dev: true, etag: true }),
      );
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    svgr(),
    assetBaseUrl(),
    backendPublicAssets(),
  ],
  server: {
    port: 3000,
    open: true,
    proxy: {
      ...(uatTarget && {
        "/api": { target: uatTarget, changeOrigin: true, headers: authHeaders },
      }),
      // Fallback for the assets that exist only on a deployed environment.
      ...(remoteAssetTarget && {
        "/public": {
          target: remoteAssetTarget,
          changeOrigin: true,
          headers: authHeaders,
        },
      }),
    },
  },
  build: {
    outDir: "build",
    assetsDir: "app_static",
    rollupOptions: {
      input: {
        main: "index.html",
        de: "index-de.html",
        it: "index-it.html",
        ch: "index-ch.html",
        fr: "index-fr.html",
        li: "index-li.html",
        si: "index-si.html",
      },
    },
  },
  define: {
    __BUILD_HASH__: JSON.stringify(Date.now().toString(36)),
    __ASSET_BASE__: JSON.stringify(ASSET_BASE),
  },
  lint: {
    plugins: ["oxc", "typescript", "unicorn", "react"],
    categories: {
      correctness: "warn",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    env: {
      builtin: true,
    },
    ignorePatterns: [
      "build/**",
      "server/**",
      "public/DianaWidget.bundle.js",
      "DianaWidget-main/**",
    ],
    rules: {
      "react/display-name": "error",
      "react/jsx-key": "error",
      "react/jsx-no-comment-textnodes": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-target-blank": "error",
      "react/jsx-no-undef": "error",
      "react/no-children-prop": "error",
      "react/no-danger-with-children": "error",
      "react/no-direct-mutation-state": "error",
      "react/no-find-dom-node": "error",
      "react/no-is-mounted": "error",
      "react/no-render-return-value": "error",
      "react/no-string-refs": "error",
      "react/no-unescaped-entities": "error",
      "react/no-unknown-property": "error",
      "react/no-unsafe": "off",
      "react/require-render-return": "error",
      "no-array-constructor": "error",
      "no-unused-expressions": "error",
      "no-unused-vars": "error",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^@mui/[^/]+$",
            },
          ],
        },
      ],
      "typescript/ban-ts-comment": "error",
      "typescript/no-duplicate-enum-values": "error",
      "typescript/no-floating-promises": "off",
      "typescript/no-empty-object-type": "error",
      "typescript/no-explicit-any": "error",
      "typescript/no-extra-non-null-assertion": "error",
      "typescript/no-misused-new": "error",
      "typescript/no-namespace": "error",
      "typescript/no-non-null-asserted-optional-chain": "error",
      "typescript/no-require-imports": "error",
      "typescript/no-this-alias": "error",
      "typescript/no-unnecessary-type-constraint": "error",
      "typescript/no-unsafe-declaration-merging": "error",
      "typescript/no-unsafe-function-type": "error",
      "typescript/no-wrapper-object-types": "error",
      "typescript/prefer-as-const": "error",
      "typescript/prefer-namespace-keyword": "error",
      "typescript/triple-slash-reference": "error",
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    overrides: [
      {
        files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
        rules: {
          "constructor-super": "error",
          "for-direction": "error",
          "getter-return": "error",
          "no-async-promise-executor": "error",
          "no-case-declarations": "error",
          "no-class-assign": "error",
          "no-compare-neg-zero": "error",
          "no-cond-assign": "error",
          "no-const-assign": "error",
          "no-constant-binary-expression": "error",
          "no-constant-condition": "error",
          "no-control-regex": "error",
          "no-debugger": "error",
          "no-delete-var": "error",
          "no-dupe-class-members": "error",
          "no-dupe-else-if": "error",
          "no-dupe-keys": "error",
          "no-duplicate-case": "error",
          "no-empty": "error",
          "no-empty-character-class": "error",
          "no-empty-pattern": "error",
          "no-empty-static-block": "error",
          "no-ex-assign": "error",
          "no-extra-boolean-cast": "error",
          "no-fallthrough": "error",
          "no-func-assign": "error",
          "no-global-assign": "error",
          "no-import-assign": "error",
          "no-invalid-regexp": "error",
          "no-irregular-whitespace": "error",
          "no-loss-of-precision": "error",
          "no-misleading-character-class": "error",
          "no-new-native-nonconstructor": "error",
          "no-nonoctal-decimal-escape": "error",
          "no-obj-calls": "error",
          "no-prototype-builtins": "error",
          "no-redeclare": "error",
          "no-regex-spaces": "error",
          "no-self-assign": "error",
          "no-setter-return": "error",
          "no-shadow-restricted-names": "error",
          "no-sparse-arrays": "error",
          "no-this-before-super": "error",
          "no-undef": "error",
          "no-unexpected-multiline": "error",
          "no-unreachable": "error",
          "no-unsafe-finally": "error",
          "no-unsafe-negation": "error",
          "no-unsafe-optional-chaining": "error",
          "no-unused-labels": "error",
          "no-unused-private-class-members": "error",
          "no-useless-backreference": "error",
          "no-useless-catch": "error",
          "no-useless-escape": "error",
          "no-with": "error",
          "require-yield": "error",
          "use-isnan": "error",
          "valid-typeof": "error",
        },
        env: {
          browser: true,
        },
      },
      {
        files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
        rules: {
          "constructor-super": "off",
          "getter-return": "off",
          "no-class-assign": "off",
          "no-const-assign": "off",
          "no-dupe-class-members": "off",
          "no-dupe-keys": "off",
          "no-func-assign": "off",
          "no-import-assign": "off",
          "no-new-native-nonconstructor": "off",
          "no-obj-calls": "off",
          "no-redeclare": "off",
          "no-setter-return": "off",
          "no-this-before-super": "off",
          "no-undef": "off",
          "no-unreachable": "off",
          "no-unsafe-negation": "off",
          "no-var": "error",
          "no-with": "off",
          "prefer-const": "error",
          "prefer-rest-params": "error",
          "prefer-spread": "error",
        },
      },
      {
        files: ["*config*.js"],
        rules: {
          "typescript/await-thenable": "off",
          "typescript/consistent-return": "off",
          "typescript/consistent-type-exports": "off",
          "typescript/dot-notation": "off",
          "typescript/no-array-delete": "off",
          "typescript/no-base-to-string": "off",
          "typescript/no-confusing-void-expression": "off",
          "typescript/no-deprecated": "off",
          "typescript/no-duplicate-type-constituents": "off",
          "typescript/no-floating-promises": "off",
          "typescript/no-for-in-array": "off",
          "typescript/no-implied-eval": "off",
          "typescript/no-meaningless-void-operator": "off",
          "typescript/no-misused-promises": "off",
          "typescript/no-misused-spread": "off",
          "typescript/no-mixed-enums": "off",
          "typescript/no-redundant-type-constituents": "off",
          "typescript/no-unnecessary-boolean-literal-compare": "off",
          "typescript/no-unnecessary-condition": "off",
          "typescript/no-unnecessary-qualifier": "off",
          "typescript/no-unnecessary-template-expression": "off",
          "typescript/no-unnecessary-type-arguments": "off",
          "typescript/no-unnecessary-type-assertion": "off",
          "typescript/no-unnecessary-type-conversion": "off",
          "typescript/no-unnecessary-type-parameters": "off",
          "typescript/no-unsafe-argument": "off",
          "typescript/no-unsafe-assignment": "off",
          "typescript/no-unsafe-call": "off",
          "typescript/no-unsafe-enum-comparison": "off",
          "typescript/no-unsafe-member-access": "off",
          "typescript/no-unsafe-return": "off",
          "typescript/no-unsafe-type-assertion": "off",
          "typescript/no-unsafe-unary-minus": "off",
          "typescript/no-useless-default-assignment": "off",
          "typescript/non-nullable-type-assertion-style": "off",
          "typescript/only-throw-error": "off",
          "typescript/prefer-find": "off",
          "typescript/prefer-includes": "off",
          "typescript/prefer-nullish-coalescing": "off",
          "typescript/prefer-optional-chain": "off",
          "typescript/prefer-promise-reject-errors": "off",
          "typescript/prefer-readonly": "off",
          "typescript/prefer-readonly-parameter-types": "off",
          "typescript/prefer-reduce-type-parameter": "off",
          "typescript/prefer-regexp-exec": "off",
          "typescript/prefer-return-this-type": "off",
          "typescript/prefer-string-starts-ends-with": "off",
          "typescript/promise-function-async": "off",
          "typescript/related-getter-setter-pairs": "off",
          "typescript/require-array-sort-compare": "off",
          "typescript/require-await": "off",
          "typescript/restrict-plus-operands": "off",
          "typescript/restrict-template-expressions": "off",
          "typescript/return-await": "off",
          "typescript/strict-boolean-expressions": "off",
          "typescript/strict-void-return": "off",
          "typescript/switch-exhaustiveness-check": "off",
          "typescript/unbound-method": "off",
          "typescript/use-unknown-in-catch-callback-variable": "off",
          "typescript/no-require-imports": "off",
        },
        env: {
          node: true,
        },
      },
    ],
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
  },
  staged: {
    "src/**/*.{js,ts,tsx}": "vp lint --fix",
    "**/*": "vp fmt",
  },
  fmt: {
    endOfLine: "lf",
    semi: true,
    singleQuote: false,
    tabWidth: 2,
    printWidth: 80,
    sortPackageJson: false,
    ignorePatterns: [
      "node_modules",
      "build",
      "dist",
      "public/DianaWidget.bundle.js",
    ],
  },
});

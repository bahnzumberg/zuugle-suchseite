import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App";
import i18n from "./translations/i18n";
import { I18nextProvider } from "react-i18next";
import { getBackgroundImageUrl, getTLD } from "./utils/globals";
import searchReducer, { CityObject } from "./features/searchSlice";
import filterReducer from "./features/filterSlice";
import { api, isValidSearchType } from "./features/apiSlice";
import { Head } from "@unhead/react";
import { createHead, UnheadProvider } from "@unhead/react/client";

const persistedCity = localStorage.getItem("city");
let cityObject: CityObject | null = null;
if (persistedCity) {
  try {
    cityObject = JSON.parse(persistedCity);
  } catch (e) {
    console.error("Error parsing city from localStorage", e);
  }
}

// As there is only one city in Liechtenstein we support,
// Vaduz will be selected and nobody has to set the city manually.
if (getTLD() === "li") {
  cityObject = { label: "Vaduz", value: "vaduz" };
}

// App routes whose first path segment is not a city slug.
const RESERVED_PATH_SEGMENTS = new Set([
  "search",
  "tour",
  "provider",
  "imprint",
  "privacy",
]);

// A single-segment path like /wien targets a specific city and must override
// any city saved in localStorage (matching the /:city route in App.tsx).
function getCitySlugFromPath(): string | null {
  const segments = window.location.pathname.split("/").filter(Boolean);
  if (segments.length === 1 && !RESERVED_PATH_SEGMENTS.has(segments[0])) {
    return segments[0];
  }
  return null;
}

function getPreloadedSearchState() {
  const params = new URLSearchParams(window.location.search);
  const searchPhrase = params.get("search") ?? "";
  const rawSearchType = params.get("search_type");

  // City precedence: /:city path segment > ?city= query > localStorage.
  const urlCitySlug = getCitySlugFromPath() ?? params.get("city");

  return {
    searchWithType: searchPhrase
      ? {
          term: searchPhrase,
          type: isValidSearchType(rawSearchType) ? rawSearchType : "term",
        }
      : null,
    // Only reuse the stored city object when it matches the URL slug; otherwise
    // SearchParamSync resolves the full CityObject once the cities list loads.
    city: !urlCitySlug || urlCitySlug === cityObject?.value ? cityObject : null,
    citySlug: urlCitySlug ?? cityObject?.value ?? null,
    map: params.get("map") === "true",
    language: params.get("lang") ?? null,
    // ?p=bahnzumberg is the legacy embed param; it enables external tour links.
    externalLinks:
      params.get("externalLinks") === "true" ||
      params.get("p") === "bahnzumberg",
    range: params.get("range") ?? null,
    bounds: null,
    geolocation: null,
  };
}

// Automatically adds the thunk middleware and the Redux DevTools extension
export const store = configureStore({
  // Automatically calls `combineReducers`
  reducer: {
    // Add the generated RTK Query "API slice" caching reducer
    [api.reducerPath]: api.reducer,
    search: searchReducer,
    filter: filterReducer,
  },
  preloadedState: { search: getPreloadedSearchState() },
  // Add the RTK Query API middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

// TODO: store.subscribe is a rough tool, use middleware instead
store.subscribe(() => {
  const newCity = store.getState().search.city;
  if (newCity !== null) {
    localStorage.setItem("city", JSON.stringify(newCity));
  } else {
    localStorage.removeItem("city");
  }
});

// Workaround for IE Mobile 10.0
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
  const msViewportStyle = document.createElement("style");
  msViewportStyle.appendChild(
    document.createTextNode("@-ms-viewport{width:auto!important}"),
  );
  document.head.appendChild(msViewportStyle);
}

const tld = getTLD();

const preloadUrl = getBackgroundImageUrl(tld);

const currentPath = window.location.pathname;
const shouldPreload = currentPath === "/";

const head = createHead();

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found");
} else {
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <UnheadProvider head={head}>
            <Head>
              <link
                rel="icon"
                type="image/png"
                href="https://cdn.zuugle.at/favicon-96x96.png"
                sizes="96x96"
              />
              <link
                rel="icon"
                type="image/svg+xml"
                href="https://cdn.zuugle.at/favicon.svg"
              />
              <link
                rel="shortcut icon"
                href="https://cdn.zuugle.at/favicon.ico"
              />
              <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="https://cdn.zuugle.at/apple-touch-icon.png"
              />
              <link rel="manifest" href="/site.webmanifest" />
              {shouldPreload && (
                <link
                  rel="preload"
                  href={preloadUrl}
                  as="image"
                  fetchPriority="high"
                />
              )}
            </Head>
            <I18nextProvider i18n={i18n}>
              <App />
            </I18nextProvider>
          </UnheadProvider>
        </BrowserRouter>
      </Provider>
    </StrictMode>,
  );
}

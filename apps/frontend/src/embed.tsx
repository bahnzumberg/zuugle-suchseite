/**
 * Embed entry point — standalone Zuugle search widget.
 *
 * Mounts a self-contained search page (search bar, filters, map, result tiles)
 * into a host page. The host provides a container element; the widget brings
 * its own Redux store, i18n, and MUI theme.
 *
 * Usage (on the host page):
 *
 *   <div id="zuugle-embed"
 *        data-lang="de"
 *        data-city="amstetten"
 *        data-map="true">
 *   </div>
 *   <script src="https://www.zuugle.at/embed/zuugle-embed.js" defer></script>
 *
 * The provider is hard-coded to "bahnzumberg" and cannot be changed by the
 * user. All other filters (region, difficulty, season, …) work normally.
 */

import { Component, ErrorInfo, ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { I18nextProvider } from "react-i18next";
import { createHead, UnheadProvider } from "@unhead/react/client";
import i18n from "./translations/i18n.embed";
import searchReducer from "./features/searchSlice";
import filterReducer from "./features/filterSlice";
import favoritesReducer, {
  initialFavoritesState,
} from "./features/favoritesSlice";
import { api } from "./features/apiSlice";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import EmbedSearchResults from "./views/EmbedSearchResults";
import { EmbedContext, type EmbedConfig } from "./utils/embedContext";

import "./App.css";

interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class EmbedErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[zuugle-embed] Fatal error inside embed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "24px",
            color: "#bf360c",
            textAlign: "center",
            fontFamily: "sans-serif",
          }}
        >
          <p style={{ fontWeight: 600, margin: "0 0 8px" }}>
            Fehler beim Laden der Zuugle-Suche.
          </p>
          <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
            {this.state.error?.message}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const FIXED_PROVIDER = "bahnzumberg";

/**
 * Reads data-* attributes from the container element to configure the widget.
 */
function readConfig(el: HTMLElement) {
  return {
    lang: el.dataset.lang || "de",
    city: el.dataset.city || null,
    map: el.dataset.map === "true",
    search: el.dataset.search || null,
  };
}

function bootstrap() {
  const container = document.getElementById("zuugle-embed");
  if (!container) {
    console.error("[zuugle-embed] No element with id='zuugle-embed' found.");
    return;
  }

  const config = readConfig(container);

  // Set the language before the store is created
  if (config.lang) {
    i18n.changeLanguage(config.lang);
  }

  // Pre-populate search state from data-* attributes
  const preloadedSearch = {
    searchWithType: config.search
      ? { term: config.search, type: "term" as const }
      : null,
    city: null,
    citySlug: config.city,
    map: config.map,
    weather: false,
    language: config.lang,
    externalLinks: true, // links point to bahn-zum-berg.at
    range: null,
    bounds: null,
    geolocation: null,
  };

  // Pre-populate filter with the fixed provider
  const preloadedFilter = {
    providers: [FIXED_PROVIDER],
  };

  const store = configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      search: searchReducer,
      filter: filterReducer,
      favorites: favoritesReducer,
    },
    preloadedState: {
      search: preloadedSearch,
      filter: preloadedFilter,
      favorites: initialFavoritesState,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

  setupListeners(store.dispatch);

  const embedConfig: EmbedConfig = {
    isEmbed: true,
    fixedProviders: [FIXED_PROVIDER],
    externalLinks: true,
  };

  const head = createHead();
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <EmbedErrorBoundary>
        <Provider store={store}>
          <UnheadProvider head={head}>
            <MemoryRouter>
              <EmbedContext.Provider value={embedConfig}>
                <ThemeProvider theme={theme}>
                  <I18nextProvider i18n={i18n}>
                    <EmbedSearchResults />
                  </I18nextProvider>
                </ThemeProvider>
              </EmbedContext.Provider>
            </MemoryRouter>
          </UnheadProvider>
        </Provider>
      </EmbedErrorBoundary>
    </StrictMode>,
  );
}

// Auto-init when the DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}

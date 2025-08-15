import React from "react";
import { createRoot } from "react-dom/client";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App";
import "./index.css";
import "./translations/i18n";
import { getTLD, isMobileDevice } from "./utils/globals";
import modalReducer from "./reducers/modal";
import tourReducer from "./reducers/tours";
import cityReducer from "./features/citySlice";
import { api } from "./features/apiSlice";
import { CityObject } from "./components/Search/Search";

const persistedCity = localStorage.getItem("city");
let cityObject: CityObject | null = null;
if (persistedCity) {
  try {
    cityObject = JSON.parse(persistedCity);
  } catch (e) {
    console.error("Error parsing city from localStorage", e);
  }
} // TODO: use zod for validating parsed objects like this

// Automatically adds the thunk middleware and the Redux DevTools extension
export const store = configureStore({
  // Automatically calls `combineReducers`
  reducer: {
    // Add the generated RTK Query "API slice" caching reducer
    [api.reducerPath]: api.reducer,
    modal: modalReducer,
    tours: tourReducer,
    city: cityReducer,
  },
  preloadedState: { city: cityObject },
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
  const newCity = store.getState().city;
  if (newCity !== null) {
    localStorage.setItem("city", JSON.stringify(newCity));
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

const preloadUrl = isMobileDevice()
  ? `/app_static/img/background_start_mobil_${tld}.webp`
  : `/app_static/img/background_start_small_${tld}.webp`;

const currentPath = window.location.pathname;
const noPreload =
  !currentPath.includes("/tour") || !currentPath.includes("/search");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found");
} else {
  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <Helmet>
            <link
              id="favicon"
              rel="icon"
              href="/app_static/favicon.png"
              type="image/x-icon"
            />
            {!noPreload && <link rel="preload" href={preloadUrl} as="image" />}
          </Helmet>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>,
  );
}

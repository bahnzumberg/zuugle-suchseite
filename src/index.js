import React from "react";
import { createRoot } from "react-dom/client";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import App from "./App";
import "./index.css";
import rootReducer from "./rootReducer";
import "./translations/i18n";
import { getTLD, isMobileDevice } from "./utils/globals";

const isDevelopment = process.env.NODE_ENV === "development";

const composeEnhancers =
  isDevelopment && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
    : compose;

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

// Workaround for IE Mobile 10.0
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
  const msViewportStyle = document.createElement("style");
  msViewportStyle.appendChild(
    document.createTextNode("@-ms-viewport{width:auto!important}")
  );
  document.head.appendChild(msViewportStyle);
}


const tld = getTLD();

const preloadUrl = isMobileDevice()
  ? `/app_static/img/background_start_mobil_${tld}.webp`
  : `/app_static/img/background_start_small_${tld}.webp`;

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
            <link rel="preload" href={preloadUrl} as="image" />
          </Helmet>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}

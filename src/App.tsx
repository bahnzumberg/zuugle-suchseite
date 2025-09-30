import { ThemeProvider } from "@mui/material/styles";
import i18next from "i18next";
import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import { theme } from "./theme";
import { getTopLevelDomain } from "./utils/globals";
import Start from "./views/Start/Start";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Importiere DetailReworked und Main jetzt dynamisch
const Main = lazy(() => import("./views/Main/Main"));
const Impressum = lazy(() => import("./views/Pages/Impressum"));
const Privacy = lazy(() => import("./views/Pages/Privacy"));
const DetailReworked = lazy(() => import("./views/Main/DetailReworked"));

function App() {
  //check if first visit and change code to domain language
  if (!localStorage.getItem("visited")) {
    const domain = getTopLevelDomain();
    //switch to domain language
    switch (domain) {
      case "si":
        i18next.changeLanguage("sl");
        break;
      case "fr":
        i18next.changeLanguage("fr");
        break;
      case "it":
        i18next.changeLanguage("it");
        break;
      default:
        i18next.changeLanguage("de");
        break;
    }
    localStorage.setItem("visited", true);
  }

  // Matomo tracking
  const _mtm = (window._mtm = window._mtm || []);
  useEffect(() => {
    _mtm.push({
      "mtm.startTime": new Date().getTime(),
      event: "mtm.Start",
    });
    const d = document,
      g = d.createElement("script"),
      s = d.getElementsByTagName("script")[0];
    g.defer = true;
    g.src = "https://stats.bahnzumberg.at/js/container_ANAXmMKf.js";
    s.parentNode.insertBefore(g, s);
    _mtm.push({ language: i18next.resolvedLanguage });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div
          className="App"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/total" element={<Start />} />
            <Route
              path="/imprint"
              element={
                <Suspense fallback={<div>Loading…</div>}>
                  <Impressum />
                </Suspense>
              }
            />
            <Route
              path="/privacy"
              element={
                <Suspense fallback={<div>Loading…</div>}>
                  <Privacy />
                </Suspense>
              }
            />
            <Route
              path="/search"
              element={
                <Suspense fallback={<div>Loading…</div>}>
                  <Main />
                </Suspense>
              }
            />
            <Route
              path="/tour/:idOne/:cityOne?"
              element={
                <Suspense fallback={<div>Loading…</div>}>
                  <DetailReworked />
                </Suspense>
              }
            />
            <Route
              path="/provider/:provider"
              element={
                <Suspense fallback={<div>Loading…</div>}>
                  <DetailReworked />
                </Suspense>
              }
            />
            <Route
              path="/:city"
              element={
                <Suspense fallback={<div>Loading…</div>}>
                  <Main />
                </Suspense>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;

import { ThemeProvider } from "@mui/material/styles";
import i18next from "i18next";
import React, { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import ModalRoot from "./components/ModalRoot";
import { theme } from "./theme";
import { getTopLevelDomain } from "./utils/globals";
import Start from "./views/Start/Start";
import "/src/config.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Main = lazy(() => import("./views/Main/Main"));
const Impressum = lazy(() => import("./views/Pages/Impressum"));
const Privacy = lazy(() => import("./views/Pages/Privacy"));
const DetailReworked = lazy(() => import("./views/Main/DetailReworked"));
const Search = lazy(() => import("./components/Search/Search"));

function App() {
  //check if first visit and change code to domain language
  if (!localStorage.getItem("visited")) {
    let domain = getTopLevelDomain();
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
          </Routes>
          <Suspense fallback={<></>}>
            <Routes>
              <Route path="/search" element={<Main />} />
              <Route
                path="/tour/:idOne/:cityOne"
                element={<DetailReworked />}
              />
              <Route path="/tour" element={<DetailReworked />} />
              <Route path="/provider/:provider" element={<DetailReworked />} />
              <Route path="/imprint" element={<Impressum />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/:city" element={<Main />} />
              <Route path="/searchPhrases" element={<Search />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
        <ModalRoot />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;

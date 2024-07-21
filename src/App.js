import * as React from "react";
import "./App.css";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { theme } from "./theme";
import Start from "./views/Start/Start";
import ModalRoot from "./components/ModalRoot";
import { Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import DetailReworked from "./views/Main/DetailReworked";
import Search from "./components/Search/Search";
import i18next from "i18next";
import { getTopLevelDomain } from "./utils/globals";

const Main = lazy(() => import("./views/Main/Main"));
// const About = lazy(() => import("./views/Pages/About"));
const Impressum = lazy(() => import("./views/Pages/Impressum"));
const Privacy = lazy(() => import("./views/Pages/Privacy"));




function App() {
  //check if first visit and change code to domain language
  if(!localStorage.getItem('visited')) {

    let domain = getTopLevelDomain();

    //switch to domain language
    switch (domain) {
      case 'si':
        i18next.changeLanguage('sl');
        break;
      case 'fr':
        i18next.changeLanguage('fr');
        break;
      case 'it':
        i18next.changeLanguage('it');
        break;
      default:
        i18next.changeLanguage('de');
        break;
    }

    localStorage.setItem('visited',true);
  }

  // Matomo tracking
  var _mtm = window._mtm = window._mtm || [];
  React.useEffect(() => {
    _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src='https://stats.bahnzumberg.at/js/container_ANAXmMKf.js'; s.parentNode.insertBefore(g,s);
    let language = i18next.resolvedLanguage;
    _mtm.push({'language': language});
  });



  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Suspense
            fallback={
              <div style={{ height: "100%", width: "100%", padding: "20px" }}>
                <CircularProgress />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Start />} />
              <Route path="/total" element={<Start />} />
              <Route path="/suche" element={<Main />} />
              <Route path="/tour/:cityOne/:idOne" element={<DetailReworked />} />
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
      </ThemeProvider>
    </>

  );
}

export default App;

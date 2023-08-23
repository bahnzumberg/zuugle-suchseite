import * as React from "react";
import "./App.css";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { theme } from "./theme";
import Start from "./views/Start/Start";
import ModalRoot from "./components/ModalRoot";
import {Route, Routes, Navigate} from "react-router-dom";
import {lazy, Suspense} from "react";
import CircularProgress from "@mui/material/CircularProgress";
import DetailReworked from "./views/Main/DetailReworked";
import {useMatomo} from "./hooks/useMatomo";
const Main = lazy(() => import('./views/Main/Main'));
const About = lazy(() => import('./views/Pages/About'));
const Impressum = lazy(() => import('./views/Pages/Impressum'));
const Privacy = lazy(() => import('./views/Pages/Privacy'));

function App() {

    // production matomo ID
    let siteId = 9;

    // UAT and local development should use matomo test instance
    if (location.hostname.indexOf('localhost') !== -1 || location.hostname.indexOf('www2.') !== -1) {
        siteId = 11;
    }

    useMatomo({
        hostConfig: {
            siteId: siteId,
            url: "https://stats.bahnzumberg.at"
        },
        enableAutoPageTrack: true
    })


    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <Suspense fallback={<div style={{height: "100%", width: "100%", padding: "20px"}}><CircularProgress /></div>}>
                        <Routes>
                            <Route path="/" element={<Start/>}/>
                            <Route path="/suche" element={<Main/>}/>
                            <Route path="/about" element={<About/>}/>
                            <Route path="/tour" element={<DetailReworked/>}/>
                            <Route path="/imprint" element={<Impressum/>}/>
                            <Route path="/privacy" element={<Privacy/>}/>
                            <Route path="/:city" element={<Main/>}/>
                            {/* <Route path="/cache" element={<TestComp/>}/> */}

                            <Route
                                path="*"
                                element={<Navigate to="/" replace />}
                            />
                        </Routes>

                </Suspense>
            </div>
            <ModalRoot />
        </ThemeProvider>
    );
}

export default App;

import * as React from 'react';
import './App.css';
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {theme} from "./theme";
import Start from "./views/Start/Start";
import ModalRoot from "./components/ModalRoot";
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import {lazy, Suspense} from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {useMatomo} from "./hooks/matomoHook";
// import TestComp from '../TestComp';
const Main = lazy(() => import('./views/Main/Main'));
const About = lazy(() => import('./views/Pages/About'));
const Impressum = lazy(() => import('./views/Pages/Impressum'));
const Privacy = lazy(() => import('./views/Pages/Privacy'));

function App() {
    // const history = createBrowserHistory();

    let siteId = 11;
    if (process.env.NODE_ENV !== "production") {
      siteId = 9;
    }



    return (
            <ThemeProvider theme={theme}>
                <div className="App">
                    <Suspense fallback={<div style={{height: "100%", width: "100%", padding: "20px"}}><CircularProgress /></div>}>
                        {/* <BrowserRouter history={history}> */}
                        <BrowserRouter >
                            <Routes>

                                <Route path="/" element={<Start/>}/>
                                <Route path="/suche" element={<Main/>}/>
                                <Route path="/about" element={<About/>}/>
                                <Route path="/imprint" element={<Impressum/>}/>
                                <Route path="/privacy" element={<Privacy/>}/>
                                <Route path="/:city" element={<Main/>}/>
                                {/* <Route path="/cache" element={<TestComp/>}/> */}

                                <Route
                                    path="*"
                                    element={<Navigate to="/" replace />}
                                />
                            </Routes>
                        </BrowserRouter>
                    </Suspense>
                </div>
                <ModalRoot />
            </ThemeProvider>
    );
}

export default App;

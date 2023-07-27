import * as React from "react";
import "./App.css";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { theme } from "./theme";
import Start from "./views/Start/Start";
import ModalRoot from "./components/ModalRoot";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { MatomoProvider, createInstance } from "@jonkoops/matomo-tracker-react";

import { lazy, Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import DetailReworked from "./views/Main/DetailReworked";
const Main = lazy(() => import("./views/Main/Main"));
const About = lazy(() => import("./views/Pages/About"));
const Impressum = lazy(() => import("./views/Pages/Impressum"));
const Privacy = lazy(() => import("./views/Pages/Privacy"));

function App() {
	let matomoConfig = {
		siteId: 11,
		useSecureCookie: false,
	};

	if (process.env.NODE_ENV === "production") {
		matomoConfig = {
			siteId: 9,
			useSecureCookie: true,
		};
	}

	const instance = createInstance({
		urlBase: `${window.location.protocol}//${window.location.host}`,
		siteId: matomoConfig.siteId,
		trackerUrl: "https://stats.bahnzumberg.at/matomo.php",
		srcUrl: "https://stats.bahnzumberg.at/matomo.js",
		disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
		heartBeat: {
			// optional, enabled by default
			active: true, // optional, default value: true
			seconds: 10, // optional, default value: `15
		},
		linkTracking: true, // optional, default value: true
		configurations: {
			// optional, default value: {}
			// any valid matomo configuration, all below are optional
			disableCookies: true,
			setSecureCookie: matomoConfig.useSecureCookie,
			setRequestMethod: "POST",
		},
	});

	return (
		<MatomoProvider value={instance}>
			<ThemeProvider theme={theme}>
				<div className="App">
					<Suspense
						fallback={
							<div style={{ height: "100%", width: "100%", padding: "20px" }}>
								<CircularProgress />
							</div>
						}
					>
						{/* <BrowserRouter history={history}> */}
						<BrowserRouter>
							<Routes>
								<Route path="/" element={<Start />} />
								<Route path="/suche" element={<Main />} />
								<Route path="/about" element={<About />} />
								<Route path="/tour" element={<DetailReworked />} />
								<Route path="/imprint" element={<Impressum />} />
								<Route path="/privacy" element={<Privacy />} />
								<Route path="/:city" element={<Main />} />
								{/* <Route path="/cache" element={<TestComp/>}/> */}

								<Route path="*" element={<Navigate to="/" replace />} />
							</Routes>
						</BrowserRouter>
					</Suspense>
				</div>
				<ModalRoot />
			</ThemeProvider>
		</MatomoProvider>
	);
}

export default App;

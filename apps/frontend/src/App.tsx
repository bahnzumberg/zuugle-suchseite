import { lazy, Suspense } from "react";
import {
  Routes,
  Route,
  Navigate,
  useSearchParams,
  useParams,
  useLocation,
} from "react-router";
import "./App.css";
import StartSkeleton from "./views/Start/StartSkeleton";
import { useGetCitiesQuery } from "./features/apiSlice";

// Lazy load the themed app shell (includes MUI ThemeProvider)
const ThemedApp = lazy(() => import("./ThemedApp"));

// Simple loading fallback for non-start routes
function SimpleLoader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#fff",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid #f3f3f3",
          borderTop: "3px solid #4A7C59",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/**
 * Renders the start page, unless ?map=true is present.
 * The hero image on "/" takes too much space for a useful map,
 * so we redirect to /search where the map is properly displayed.
 */
function StartOrRedirectToSearch() {
  const [params] = useSearchParams();
  if (params.get("map") === "true") {
    return <Navigate to={`/search?${params.toString()}`} replace />;
  }
  return (
    <Suspense fallback={<StartSkeleton />}>
      <ThemedApp routeKey="start" />
    </Suspense>
  );
}

/**
 * Handles /:city — if the slug matches a known city, render SearchResults.
 * Otherwise redirect to /search?search=<slug>, preserving other query params.
 */
function CityOrSearchRedirect() {
  const { city } = useParams<{ city: string }>();
  const [params] = useSearchParams();
  const { data: allCities, isLoading } = useGetCitiesQuery();

  // While cities are loading, show a spinner to avoid a flash redirect
  if (isLoading || !allCities) {
    return <SimpleLoader />;
  }

  const isKnownCity = allCities.some((c) => c.value === city);

  if (isKnownCity) {
    return (
      <Suspense fallback={<SimpleLoader />}>
        <ThemedApp routeKey="city" />
      </Suspense>
    );
  }

  // Unknown slug — redirect to /search?search=<slug> with existing params
  const newParams = new URLSearchParams(params);
  newParams.set("search", city || "");
  return <Navigate to={`/search?${newParams.toString()}`} replace />;
}

/**
 * Handles /search/:searchTerm — redirects to /search?search=<searchTerm>,
 * preserving any other query params.
 */
function SearchTermRedirect() {
  const { searchTerm } = useParams<{ searchTerm: string }>();
  const [params] = useSearchParams();
  const newParams = new URLSearchParams(params);
  newParams.set("search", searchTerm || "");
  return <Navigate to={`/search?${newParams.toString()}`} replace />;
}

/**
 * Catch-all: extracts the unknown path and redirects to /search?search=<path>,
 * preserving any query params.
 */
function CatchAllRedirect() {
  const location = useLocation();
  const [params] = useSearchParams();

  // Extract the path without leading slash
  const slug = location.pathname.replace(/^\/+/, "");
  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const newParams = new URLSearchParams(params);
  newParams.set("search", slug);
  return <Navigate to={`/search?${newParams.toString()}`} replace />;
}

function App() {
  return (
    <main
      className="App"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Routes>
        {/* Start page — redirect to /search when ?map=true */}
        <Route path="/" element={<StartOrRedirectToSearch />} />
        <Route path="/total" element={<StartOrRedirectToSearch />} />

        {/* Other routes with simple loader */}
        <Route
          path="/imprint"
          element={<Navigate to="/search?legal=imprint" replace />}
        />
        <Route
          path="/privacy"
          element={<Navigate to="/search?legal=privacy" replace />}
        />
        <Route path="/search/:searchTerm" element={<SearchTermRedirect />} />
        <Route
          path="/search"
          element={
            <Suspense fallback={<SimpleLoader />}>
              <ThemedApp routeKey="search" />
            </Suspense>
          }
        />
        <Route
          path="/tour/:idOne/:cityOne?"
          element={
            <Suspense fallback={<SimpleLoader />}>
              <ThemedApp routeKey="tour" />
            </Suspense>
          }
        />
        <Route
          path="/provider/:provider"
          element={
            <Suspense fallback={<SimpleLoader />}>
              <ThemedApp routeKey="provider" />
            </Suspense>
          }
        />
        <Route path="/:city" element={<CityOrSearchRedirect />} />

        <Route path="*" element={<CatchAllRedirect />} />
      </Routes>
    </main>
  );
}

export default App;

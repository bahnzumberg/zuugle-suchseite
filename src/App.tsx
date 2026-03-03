import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";
import "./App.css";
import StartSkeleton from "./views/Start/StartSkeleton";

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

function App() {
  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Routes>
        {/* Start page with skeleton fallback */}
        <Route
          path="/"
          element={
            <Suspense fallback={<StartSkeleton />}>
              <ThemedApp routeKey="start" />
            </Suspense>
          }
        />
        <Route
          path="/total"
          element={
            <Suspense fallback={<StartSkeleton />}>
              <ThemedApp routeKey="start" />
            </Suspense>
          }
        />

        {/* Other routes with simple loader */}
        <Route
          path="/imprint"
          element={
            <Suspense fallback={<SimpleLoader />}>
              <ThemedApp routeKey="imprint" />
            </Suspense>
          }
        />
        <Route
          path="/privacy"
          element={
            <Suspense fallback={<SimpleLoader />}>
              <ThemedApp routeKey="privacy" />
            </Suspense>
          }
        />
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
        <Route
          path="/:city"
          element={
            <Suspense fallback={<SimpleLoader />}>
              <ThemedApp routeKey="city" />
            </Suspense>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;

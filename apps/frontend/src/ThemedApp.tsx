import { ThemeProvider } from "@mui/material/styles";
import i18next from "i18next";
import { lazy, Suspense, useEffect } from "react";
import { theme } from "./theme";
import LanguageParamSync from "./components/LanguageParamSync";
import CookieConsent from "./components/CookieConsent";
import FavoritesNotice from "./components/Favorites/FavoritesNotice";
import { useAppSelector } from "./hooks";
import { useConsent } from "./hooks/useConsent";

const StartNew = lazy(() => import("./views/StartNew"));
const SearchResults = lazy(() => import("./views/SearchResults"));
const DetailReworked = lazy(() => import("./views/TourDetails"));
// This shell loads on every route, and the dialog pulls in a QR renderer plus
// the MUI dialog and form tree for something opened rarely — so it is fetched
// on the click that opens it rather than on every page load.
const SyncFavoritesDialog = lazy(
  () => import("./components/Favorites/SyncFavoritesDialog"),
);

interface ThemedAppProps {
  routeKey: "start" | "search" | "tour" | "provider" | "city";
}

export default function ThemedApp({ routeKey }: ThemedAppProps) {
  const { isComfortAllowed } = useConsent();
  const syncDialogOpen = useAppSelector(
    (state) => state.favorites.syncDialog.open,
  );

  // Matomo Tag Manager — only loaded when comfort cookies are accepted
  useEffect(() => {
    if (!isComfortAllowed) return;

    // @ts-expect-error matomo
    const _mtm = (window._mtm = window._mtm || []);
    _mtm.push({
      "mtm.startTime": new Date().getTime(),
      event: "mtm.Start",
    });
    const d = document,
      g = d.createElement("script"),
      s = d.getElementsByTagName("script")[0];
    g.defer = true;
    g.src = "https://stats.bahnzumberg.at/js/container_ANAXmMKf.js";
    // #912 — SRI: update hash when Matomo container config changes
    g.integrity =
      "sha384-PfmDP5WvAB0aekGzhQUE4QW9O/M6t+rf7IzMkNAHzzlNcE4LfyTzudOzb0XtdPW1";
    g.crossOrigin = "anonymous";
    s.parentNode?.insertBefore(g, s);
    _mtm.push({ language: i18next.resolvedLanguage });
  }, [isComfortAllowed]);

  const renderRoute = () => {
    switch (routeKey) {
      case "start":
        return <StartNew />;
      case "search":
      case "city":
        return <SearchResults />;
      case "tour":
      case "provider":
        return <DetailReworked />;
      default:
        return <StartNew />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LanguageParamSync />
      {renderRoute()}
      {syncDialogOpen && (
        <Suspense fallback={null}>
          <SyncFavoritesDialog />
        </Suspense>
      )}
      <FavoritesNotice />
      <CookieConsent />
    </ThemeProvider>
  );
}

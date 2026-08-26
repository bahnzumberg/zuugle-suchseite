import { ThemeProvider } from "@mui/material/styles";
import i18next from "i18next";
import { lazy, useEffect } from "react";
import { theme } from "./theme";
import LanguageParamSync from "./components/LanguageParamSync";
import CookieConsent from "./components/CookieConsent";
import { useConsent } from "./hooks/useConsent";
import FavoritesErrorSnackbar from "./components/Favorites/FavoritesErrorSnackbar";

const StartNew = lazy(() => import("./views/StartNew"));
const SearchResults = lazy(() => import("./views/SearchResults"));
const DetailReworked = lazy(() => import("./views/TourDetails"));

interface ThemedAppProps {
  routeKey: "start" | "search" | "tour" | "provider" | "city";
}

export default function ThemedApp({ routeKey }: ThemedAppProps) {
  const { isComfortAllowed } = useConsent();

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
      <CookieConsent />
      <FavoritesErrorSnackbar />
    </ThemeProvider>
  );
}

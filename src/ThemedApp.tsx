import { ThemeProvider } from "@mui/material/styles";
import i18next from "i18next";
import { lazy, useEffect } from "react";
import { theme } from "./theme";
import LanguageParamSync from "./components/LanguageParamSync";
import CookieConsent from "./components/CookieConsent";

const StartNew = lazy(() => import("./views/StartNew"));
const SearchResults = lazy(() => import("./views/SearchResults"));
const DetailReworked = lazy(() => import("./views/TourDetails"));

interface ThemedAppProps {
  routeKey: "start" | "search" | "tour" | "provider" | "city";
}

export default function ThemedApp({ routeKey }: ThemedAppProps) {
  // Matomo tracking
  useEffect(() => {
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
    s.parentNode?.insertBefore(g, s);
    _mtm.push({ language: i18next.resolvedLanguage });
  }, []);

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
    </ThemeProvider>
  );
}

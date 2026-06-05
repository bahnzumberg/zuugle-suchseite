import { ThemeProvider } from "@mui/material/styles";
import i18next from "i18next";
import { lazy, useEffect } from "react";
import { theme } from "./theme";
import { getTopLevelDomain } from "./utils/globals";

const Start = lazy(() => import("./views/Start/Start"));
const SearchResults = lazy(() => import("./views/SearchResults"));
const Imprint = lazy(() => import("./views/Imprint"));
const Privacy = lazy(() => import("./views/Privacy"));
const DetailReworked = lazy(() => import("./views/TourDetails"));

interface ThemedAppProps {
  routeKey:
    | "start"
    | "search"
    | "tour"
    | "provider"
    | "city"
    | "imprint"
    | "privacy";
}

export default function ThemedApp({ routeKey }: ThemedAppProps) {
  // Set language on first visit
  useEffect(() => {
    if (!localStorage.getItem("visited")) {
      const domain = getTopLevelDomain();
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
      localStorage.setItem("visited", String(true));
    }
  }, []);

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
        return <Start />;
      case "search":
      case "city":
        return <SearchResults />;
      case "tour":
      case "provider":
        return <DetailReworked />;
      case "imprint":
        return <Imprint />;
      case "privacy":
        return <Privacy />;
      default:
        return <Start />;
    }
  };

  return <ThemeProvider theme={theme}>{renderRoute()}</ThemeProvider>;
}

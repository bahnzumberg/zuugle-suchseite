import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const supportedLanguages = ["en", "de", "sl", "fr", "it"];

const detectionOptions = {
  order: [
    "querystring",
    "cookie",
    "localStorage",
    "sessionStorage",
    "navigator",
    "htmlTag",
    "path",
    "subdomain",
  ],
};

i18n
  .use(Backend) // Hier wird das Backend-Plugin verwendet, um die Dateien zu laden
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Wir verwenden nicht mehr den "resources"-Block,
    // da das Backend die Dateien dynamisch lädt.
    backend: {
      loadPath: "/app_static/i18n/{{lng}}.json", // Pfad zu den JSON-Dateien im Build-Verzeichnis
      requestOptions: {
        cache: "no-cache",
        credentials: "include",
      },
      crossDomain: true,
      withCredentials: true,
    },
    //lng: "de", // Diese Zeile muss auskommentiert bleiben, da du LanguageDetector verwendest
    fallbackLng: "de",
    supportedLngs: supportedLanguages,
    nonExplicitSupportedLngs: true,
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
    detection: detectionOptions,
  });

export default i18n;

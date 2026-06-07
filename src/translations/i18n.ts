import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const supportedLanguages = ["en", "de", "sl", "fr", "it"];

// On the first visit, set the language from the domain TLD before i18next
// initialises so the browser-language detector reads the right value from
// localStorage and avoids a post-render language switch.
if (!localStorage.getItem("visited")) {
  const tldToLang: Record<string, string> = { si: "sl", fr: "fr", it: "it" };
  const tld = window.location.hostname.split(".").pop() ?? "";
  localStorage.setItem("i18nextLng", tldToLang[tld] ?? "de");
  localStorage.setItem("visited", "true");
}

const detectionOptions = {
  order: [
    "querystring",
    "localStorage",
    "sessionStorage",
    "navigator",
    "htmlTag",
  ],
  caches: ["localStorage"],
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `${import.meta.env.BASE_URL}i18n/{{lng}}.json?v=${__BUILD_HASH__}`,
    },
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

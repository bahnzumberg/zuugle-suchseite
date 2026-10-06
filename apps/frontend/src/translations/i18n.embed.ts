import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import deTranslations from "../../../../assets/i18n/de.json";

// In embed mode, only German is used and translations are bundled directly
// so no external HTTP requests to /i18n/de.json are made on third-party sites.
i18n.use(initReactI18next).init({
  resources: {
    de: {
      translation: deTranslations,
    },
  },
  lng: "de",
  fallbackLng: "de",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;

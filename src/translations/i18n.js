import i18n from 'i18next';
import Backend from "i18next-http-backend";
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const resources = {
    fr: {
        translation: require("../../public/i18n/fr.json")
      },
    en: {
      translation: require("../../public/i18n/en.json")
    },
    de: {
      translation: require("../../public/i18n/de.json")
    },
    it: {
      translation: require("../../public/i18n/it.json")
    },
    sl: {
      translation: require("../../public/i18n/sl.json")
    }
};

const supportedLanguages = ['en','de','sl','fr','it'];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Backend:{
    //     loadpath: `/public/i18n/{lng}.json`,
    // },
    resources,
    //lng: "de", // see note 1 below
    fallbackLng: "de",
    supportedLngs: supportedLanguages,
    nonExplicitSupportedLngs: true, //note 3 below
    debug: false,
    // debug: process.env.NODE_ENV === "development",
    interpolation: {
      spaceValue: false,
      formatSeperator: ",",
    },
    react: {
      // wait : true,
      useSuspense: true,
    },
  });

export default i18n


//notes: https://phrase.com/blog/posts/localizing-react-apps-with-i18next/ 
// 1. lng 
//   1.1 : Set lng can be unsupported language as well
//   1.2 : Set lng must be deleted if using language detector
// 2. language detector
//         That’s basically all we need to start detecting the user’s preferred language. Here’s what the detector will do by default:
//         Attempt to find a ?lng=en query string parameter in the request URL. If this fails,
//         Attempt to find a domain cookie called "i18next" with a stored language. If this fails,
//         Attempt to find an entry in the domain’s localStorage called "i18nextLng" with a stored language. If this fails,
//         Attempt to find an entry in session storage called "i18nextLng" with a stored language. If this fails,
//         Attempt to determine the user’s first preferred language from her browser settings (navigator object). If this fails,
//         Attempt to determine the language from the lang attribute of the page’s <html> tag.
//         At this point, a language should have been detected. The detected language will get saved in a cookie, localStorage, or session storage so that  
//         the user will see this language on her next visit to our site.
// 3.  nonExplicitSupportedLngs
//         set nonExplicitSupportedLngs: true, so that an ar-EG (Egyptian Arabic) user will see the ar (Arabic) version of our app
// 4.  i18n.changeLanguage()
//         If the active language is changed manually via i18n.changeLanguage(code), the detector will store this language for the user’s next visit.
// 5.  Simple plurals
//         The counter variable must be called count, otherwise plural selection won’t work.
import useMediaQuery from "@mui/material/useMediaQuery";
import { theme } from "../theme";
import { Tour } from "../models/Tour";
import { i18n } from "i18next";

export function getTourLink(
  tour: Tour,
  city: string | null,
  provider: string | null,
) {
  if (city && city !== "no-city") {
    if (provider === "bahnzumberg") {
      return `${tour.url}ab-${city}/`;
    } else {
      return `/tour/${tour.id}/${city}`;
    }
  } else {
    if (provider === "bahnzumberg") {
      return `${tour.url}`;
    } else {
      return `/tour/${tour.id}/no-city`;
    }
  }
}

export function convertNumToTime(number: number, nonseparate = false) {
  // Check sign of given number
  const sign = number >= 0 ? 1 : -1;

  // Set positive value of number of sign negative
  number = number * sign;

  // Separate the int from the decimal part
  const hour = Math.floor(number);
  let decpart = number - hour;

  const min = 1 / 60;
  // Round to nearest minute
  decpart = min * Math.round(decpart / min);

  let minute = Math.floor(decpart * 60) + "";

  // Add padding if need
  if (minute.length < 2) {
    minute = "0" + minute;
  }

  return !nonseparate ? `${hour} h ${minute} min` : `${hour}:${minute} h`;
}

export const get_currLanguage = (i18n: i18n) => {
  const resolvedLanguage = i18n.language;
  const storedLanguage = localStorage.getItem("lang");
  const currLanguage = storedLanguage || resolvedLanguage;
  return currLanguage;
};

export const simpleConvertNumToTime = (number: number) => {
  let timeStr = convertNumToTime(number);
  timeStr = timeStr.replace(/ h/g, "").replace(/ min/g, "");
  if (!timeStr.includes(":")) {
    timeStr = timeStr.replace(/(\d+)\s+(\d+)/, "$1:$2");
  }
  return timeStr;
};

export function formatNumber(number: string, postfix = "") {
  return parseFloat(number).toLocaleString("de-AT") + postfix;
}

export const parseFileName = (name: string, prefix = "", postfix = "") => {
  const charMap: Record<string, string> = {
    ä: "ae",
    ü: "ue",
    ö: "oe",
    ß: "ss",
    " ": "_",
  };
  return (
    prefix +
    name.toLowerCase().replace(/[äöüß ]/g, (char) => charMap[char] || char) +
    postfix
  );
};

export const getDomainText = () => {
  const host = window.location.hostname;
  if (host.indexOf("www.zuugle.at") >= 0) {
    return "Zuugle.at";
  } else if (host.indexOf("www.zuugle.de") >= 0) {
    return "Zuugle.de";
  } else if (host.indexOf("www.zuugle.ch") >= 0) {
    return "Zuugle.ch";
  } else if (host.indexOf("www.zuugle.li") >= 0) {
    return "Zuugle.li";
  } else if (host.indexOf("www.zuugle.it") >= 0) {
    return "Zuugle.it";
  } else if (host.indexOf("www.zuugle.fr") >= 0) {
    return "Zuugle.fr";
  } else if (host.indexOf("www.zuugle.si") >= 0) {
    return "Zuugle.si";
  } else if (host.indexOf("www2.zuugle.at") >= 0) {
    return "UAT Zuugle.at";
  } else if (host.indexOf("www2.zuugle.de") >= 0) {
    return "UAT Zuugle.de";
  } else if (host.indexOf("www2.zuugle.ch") >= 0) {
    return "UAT Zuugle.ch";
  } else if (host.indexOf("www2.zuugle.fr") >= 0) {
    return "UAT Zuugle.fr";
  } else if (host.indexOf("www2.zuugle.it") >= 0) {
    return "UAT Zuugle.it";
  } else if (host.indexOf("www2.zuugle.si") >= 0) {
    return "UAT Zuugle.si";
  } else {
    return "Localhost";
  }
};

export const isMobileDevice = () => {
  return /Mobi|Android|iPhone|iPad|Windows Phone|BlackBerry|Opera Mini|IEMobile/i.test(
    navigator.userAgent,
  );
};

// export const get_meta_data = (page) => {

//     let meta = [];
//     const _domaintext = getDomainText();
//     const host = window.location.hostname;

//     meta.currLang = '<meta http-equiv="content-language" content="'+get_currLanguage()+'" />';

//     if (page === 'Start') {
//         if (_domaintext === "Zuugle.fr") {
//             meta.canonical = '<link rel="canonical" href="https://www.zuugle.fr" hreflang="fr-fr" />'
//             meta.preconnect_bzb = '';
//         } else if (_domaintext === "Zuugle.si") {
//             meta.canonical = '<link rel="canonical" href="https://www.zuugle.si" hreflang="sl-si" />'
//             meta.preconnect_bzb = '';
//         } else if (_domaintext === "Zuugle.de") {
//             meta.canonical = '<link rel="canonical" href="https://www.zuugle.de" hreflang="de-de" />'
//             meta.preconnect_bzb = '<link rel="preconnect" href="https://www.bahn-zum-berg.at" /> '
//         } else if (_domaintext === "Zuugle.it") {
//             meta.canonical = '<link rel="canonical" href="https://www.zuugle.it" hreflang="it-it" />'
//             meta.preconnect_bzb = '';
//         } else if (_domaintext === "Zuugle.ch") {
//             meta.canonical = '<link rel="canonical" href="https://www.zuugle.ch" hreflang="de-ch" />'
//             meta.preconnect_bzb = '';
//         } else if (_domaintext === "Zuugle.li") {
//             meta.canonical = '<link rel="canonical" href="https://www.zuugle.li" hreflang="de-li" />'
//             meta.preconnect_bzb = '';
//         } else {
//             meta.canonical = '<link rel="canonical" href="https://www.zuugle.at" hreflang="de-at" />';
//             meta.preconnect_bzb = '<link rel="preconnect" href="https://www.bahn-zum-berg.at" /> ';
//         }
//         meta.opengraph = '<meta property="og:url" content="'+host+'"><meta property="og:title" content="'+t("start.helmet_title")+'"><meta property="og:description" content="'+t("index.zuugle_description")+'"><meta property="og:image" content="'+host+'/app_static/img/Zuugle_Opengraph.jpg">';
//         meta.twitter = '<meta property="twitter:url" content="'+host+'"><meta property="twitter:title" content="'+t("start.helmet_title")+'"><meta property="twitter:description" content="'+t("index.zuugle_description")+'"><meta property="twitter:image" content="'+host+'/app_static/img/Zuugle_Opengraph.jpg">';
//     } else if (page === 'Impressum') {
//         meta.preconnect_bzb = '';
//         meta.canonical = '<link rel="alternate" href="https://www.zuugle.fr/imprint" hreflang="fr-fr" />'
//                        + '<link rel="alternate" href="https://www.zuugle.si/imprint" hreflang="sl-si" />'
//                        + '<link rel="alternate" href="https://www.zuugle.de/imprint" hreflang="de-de" />'
//                        + '<link rel="alternate" href="https://www.zuugle.it/imprint" hreflang="it-it" />'
//                        + '<link rel="alternate" href="https://www.zuugle.ch/imprint" hreflang="de-ch" />'
//                        + '<link rel="alternate" href="https://www.zuugle.li/imprint" hreflang="de-li" />'
//                        + '<link rel="canonical" href="https://www.zuugle.at/imprint" hreflang="de-at" />';
//         meta.opengraph = '<meta property="og:url" content="'+host+'"><meta property="og:title" content="Impressum - '+t("start.helmet_title")+'"><meta property="og:description" content="'+t("index.zuugle_description")+'"><meta property="og:image" content="'+host+'/app_static/img/Zuugle_Opengraph.jpg">';
//         meta.twitter = '<meta property="twitter:url" content="'+host+'"><meta property="twitter:title" content="Impressum - '+t("start.helmet_title")+'"><meta property="twitter:description" content="'+t("index.zuugle_description")+'"><meta property="twitter:image" content="'+host+'/app_static/img/Zuugle_Opengraph.jpg">';
//     } else if (page === 'Privacy') {
//         meta.preconnect_bzb = '';
//         meta.canonical = '<link rel="alternate" href="https://www.zuugle.fr/privacy" hreflang="fr-fr" />'
//                        + '<link rel="alternate" href="https://www.zuugle.si/privacy" hreflang="sl-si" />'
//                        + '<link rel="alternate" href="https://www.zuugle.de/privacy" hreflang="de-de" />'
//                        + '<link rel="alternate" href="https://www.zuugle.it/privacy" hreflang="it-it" />'
//                        + '<link rel="alternate" href="https://www.zuugle.ch/privacy" hreflang="de-ch" />'
//                        + '<link rel="alternate" href="https://www.zuugle.li/privacy" hreflang="de-li" />'
//                        + '<link rel="canonical" href="https://www.zuugle.at/privacy" hreflang="de-at" />';
//         meta.opengraph = '<meta property="og:url" content="'+host+'"><meta property="og:title" content="Privacy - '+t("start.helmet_title")+'"><meta property="og:description" content="'+t("index.zuugle_description")+'"><meta property="og:image" content="'+host+'/app_static/img/Zuugle_Opengraph.jpg">';
//         meta.twitter = '<meta property="twitter:url" content="'+host+'"><meta property="twitter:title" content="Privacy - '+t("start.helmet_title")+'"><meta property="twitter:description" content="'+t("index.zuugle_description")+'"><meta property="twitter:image" content="'+host+'/app_static/img/Zuugle_Opengraph.jpg">';
//     } else if (page === 'Main') {
//         if (_domaintext === "Zuugle.fr") {
//             meta.canonical = '<link rel="canonical" href="https://www.zuugle.fr/search" hreflang="fr-fr" />'
//             meta.preconnect_bzb = '';
//         } else if (_domaintext === "Zuugle.si") {
//             meta.canonical = '<link rel="canonical" href="https://www.zuugle.si/search" hreflang="sl-si" />'
//             meta.preconnect_bzb = '';
//         } else if (_domaintext === "Zuugle.de") {
//             meta.canonical = '<link rel="canonical" href="https://www.zuugle.de/search" hreflang="de-de" />'
//             meta.preconnect_bzb = '<link rel="preconnect" href="https://www.bahn-zum-berg.at" /> '
//         } else if (_domaintext === "Zuugle.it") {
//             meta.canonical = '<link rel="canonical" href="https://www.zuugle.it/search" hreflang="it-it" />'
//             meta.preconnect_bzb = '';
//         } else if (_domaintext === "Zuugle.ch") {
//             meta.canonical = '<link rel="canonical" href="https://www.zuugle.ch/search" hreflang="de-ch" />'
//             meta.preconnect_bzb = '';
//         } else if (_domaintext === "Zuugle.li") {
//             meta.canonical = '<link rel="canonical" href="https://www.zuugle.li/search" hreflang="de-li" />'
//             meta.preconnect_bzb = '';
//         } else {
//             meta.canonical = '<link rel="canonical" href="https://www.zuugle.at/search" hreflang="de-at" />';
//             meta.preconnect_bzb = '<link rel="preconnect" href="https://www.bahn-zum-berg.at" /> ';
//         }

//         meta.opengraph = '<meta property="og:url" content="'+host+'"><meta property="og:title" content="Search - '+t("start.helmet_title")+'"><meta property="og:description" content="'+t("index.zuugle_description")+'"><meta property="og:image" content="'+host+'/app_static/img/Zuugle_Opengraph.jpg">';
//         meta.twitter = '<meta property="twitter:url" content="'+host+'"><meta property="twitter:title" content="Search - '+t("start.helmet_title")+'"><meta property="twitter:description" content="'+t("index.zuugle_description")+'"><meta property="twitter:image" content="'+host+'/app_static/img/Zuugle_Opengraph.jpg">';
//     }

//     // console.log("meta: ", meta.currLang+meta.canonical+meta.preconnect_bzb+meta.opengraph+meta.twitter)
//     return meta.currLang+meta.canonical+meta.preconnect_bzb+meta.opengraph+meta.twitter;
// }

export const useIsMobile = () => useMediaQuery(theme.breakpoints.down("md"));

export const getTopLevelDomain = () => {
  const domain = window.location.hostname;
  let tld = "at";

  if (domain.indexOf("zuugle.de") > 0) {
    tld = "de";
  } else if (domain.indexOf("zuugle.si") > 0) {
    tld = "si";
  } else if (domain.indexOf("zuugle.it") > 0) {
    tld = "it";
  } else if (domain.indexOf("zuugle.ch") > 0) {
    tld = "ch";
  } else if (domain.indexOf("zuugle.li") > 0) {
    tld = "li";
  } else if (domain.indexOf("zuugle.fr") > 0) {
    tld = "fr";
  }

  return tld;
};

export const getTimeFromConnectionDescriptionEntry = (entry: string) => {
  const _entry = entry ? entry.trim() : null;
  if (!!_entry && _entry.length > 5) {
    return _entry.substring(0, 5);
  }
  return "";
};

export const getTextFromConnectionDescriptionEntry = (entry: string) => {
  const _entry = entry ? entry.trim() : null;
  if (!!_entry && _entry.length > 5) {
    return _entry.substring(5);
  }
  return "";
};

export const shortenText = (
  text: string,
  atChar: number,
  maxLength: number,
) => {
  let shortText = text;
  if (text.length > maxLength) {
    shortText = text.slice(atChar, maxLength).concat("...");
  }
  return shortText;
};

export function randomKey(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function getTLD() {
  // Mapping of domain substrings to TLDs
  const tldMap: Record<string, string> = {
    "zuugle.de": "de",
    "zuugle.si": "si",
    "zuugle.it": "it",
    "zuugle.ch": "ch",
    "zuugle.li": "li",
    "zuugle.fr": "fr",
  };

  // Get the hostname of the current window
  const domain = window.location.hostname;

  // Find the TLD by checking the domain substrings
  for (const key in tldMap) {
    if (domain.indexOf(key) > -1) {
      return tldMap[key];
    }
  }
  // Default TLD if no match is found
  return "at";
}

export const capitalize = (str: string) => {
  if (typeof str !== "string" || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const areSetsEqual = (set1: Set<any>, set2: Set<any>): boolean =>
  set1.size === set2.size && [...set1].every((value) => set2.has(value));

export function hasContent(obj: unknown): boolean {
  return obj != null && Object.keys(obj).length > 0;
}

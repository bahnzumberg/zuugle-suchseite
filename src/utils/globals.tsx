import { Tour } from "../models/Tour";
import { i18n } from "i18next";

/**
 * Rewrites the domain in a bahn-zum-berg URL to match the current Zuugle TLD.
 * zuugle.it → bahn-zum-berg.it, zuugle.ch → .ch, zuugle.de → .de,
 * all others → bahn-zum-berg.at
 */
function rewriteBahnZumBergDomain(url: string): string {
  const tld = getTLD(); // "it" | "ch" | "de" | "at" | ...
  const targetTld = ["it", "ch", "de"].includes(tld) ? tld : "at";
  return url.replace(/bahn-zum-berg\.\w+/i, `bahn-zum-berg.${targetTld}`);
}

export function getTourLink(
  tour: Tour,
  city: string | null,
  provider: string | null,
) {
  if (city && city !== "no-city") {
    if (provider === "bahnzumberg") {
      return `${rewriteBahnZumBergDomain(tour.url)}ab-${city}/`;
    } else {
      return `/tour/${tour.id}/${city}`;
    }
  } else {
    if (provider === "bahnzumberg") {
      return `${rewriteBahnZumBergDomain(tour.url)}`;
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

export function formatNumber(number: string | number, postfix = "") {
  const num = typeof number === "string" ? parseFloat(number) : number;
  if (isNaN(num)) return "";
  return num.toLocaleString("de-AT") + postfix;
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

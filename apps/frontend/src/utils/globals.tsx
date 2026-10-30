import { Tour } from "../models/Tour";
import { i18n } from "i18next";
import { Dayjs } from "dayjs";
import { getApiDomain } from "./apiBase";
import {
  ZUUGLE_COUNTRIES,
  getCountryForHost,
  getCountryHost,
  getDomainName,
  isUatHost,
} from "./domains";

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
  externalLinks: boolean,
) {
  if (city && city !== "no-city") {
    if (externalLinks) {
      return `${rewriteBahnZumBergDomain(tour.url)}ab-${city}/`;
    } else {
      return `/tour/${tour.id}/${city}`;
    }
  } else {
    if (externalLinks) {
      return `${rewriteBahnZumBergDomain(tour.url)}`;
    } else {
      return `/tour/${tour.id}/no-city`;
    }
  }
}

/**
 * `target`/`rel` for a link to a tour. On mobile our own detail page opens in
 * the same tab so native Back returns to the results. Otherwise it opens in a
 * new tab that keeps this search tab as opener, so the detail tab can detect
 * it is still open; external (cross-origin) links stay noopener for safety.
 */
export function getTourLinkTarget(
  isMobile: boolean,
  externalLinks: boolean,
): { target?: "_blank"; rel?: "opener" | "noopener" } {
  if (isMobile && !externalLinks) return {};
  return { target: "_blank", rel: externalLinks ? "noopener" : "opener" };
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
  const uat = isUatHost(host);
  const country = ZUUGLE_COUNTRIES.find((c) =>
    host.includes(getCountryHost(c, uat)),
  );
  return country ? getDomainName(country, uat) : "Localhost";
};

export const isMobileDevice = () => {
  return /Mobi|Android|iPhone|iPad|Windows Phone|BlackBerry|Opera Mini|IEMobile/i.test(
    navigator.userAgent,
  );
};

export function getBackgroundImageUrl(tld: string, mobile = isMobileDevice()) {
  const dimensions = mobile
    ? "aspect_ratio=500:570&width=500"
    : "aspect_ratio=1200:798&width=1200";
  return `https://cdn.bahn-zum-berg.at/zuugle/zuugle-${tld}.jpg?${dimensions}`;
}

export const getTopLevelDomain = () =>
  getCountryForHost(window.location.hostname).tld;

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
  return getCountryForHost(getApiDomain()).tld;
}

export const capitalize = (str: string) => {
  if (typeof str !== "string" || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// oxlint-disable-next-line @typescript-eslint/no-explicit-any
export const areSetsEqual = (set1: Set<any>, set2: Set<any>): boolean =>
  set1.size === set2.size && [...set1].every((value) => set2.has(value));

export function hasContent(obj: unknown): boolean {
  return obj != null && Object.keys(obj).length > 0;
}

export function getDurationAsHours(dayJsObject: Dayjs | null) {
  if (dayJsObject) {
    return dayJsObject.hour() + dayJsObject.minute() / 60;
  }
}

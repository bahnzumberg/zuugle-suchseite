export interface ZuugleCountry {
  /** 2-letter uppercase ISO country code. */
  code: string;
  tld: string;
  /** i18n key of the country name. */
  nameKey: string;
  /** Whether a `www2.` UAT domain exists for this country. */
  hasUat: boolean;
}

export const ZUUGLE_COUNTRIES: ZuugleCountry[] = [
  { code: "AT", tld: "at", nameKey: "start.oesterreich", hasUat: true },
  { code: "CH", tld: "ch", nameKey: "start.schweiz", hasUat: true },
  { code: "DE", tld: "de", nameKey: "start.deutschland", hasUat: true },
  { code: "FR", tld: "fr", nameKey: "start.frankreich", hasUat: true },
  { code: "IT", tld: "it", nameKey: "start.italien", hasUat: true },
  { code: "LI", tld: "li", nameKey: "start.liechtenstein", hasUat: false },
  { code: "SI", tld: "si", nameKey: "start.slowenien", hasUat: true },
];

const DEFAULT_COUNTRY = ZUUGLE_COUNTRIES[0];

export function getCountryByCode(code: string): ZuugleCountry | undefined {
  const upper = code.toUpperCase();
  return ZUUGLE_COUNTRIES.find((c) => c.code === upper);
}

/** Falls back to Austria for hosts that are not a Zuugle domain (e.g. localhost). */
export function getCountryForHost(host: string): ZuugleCountry {
  return (
    ZUUGLE_COUNTRIES.find((c) => host.includes(`zuugle.${c.tld}`)) ??
    DEFAULT_COUNTRY
  );
}

export function isUatHost(host: string): boolean {
  return host.includes("www2.");
}

/** Falls back to the PROD host for countries without a UAT domain. */
export function getCountryHost(country: ZuugleCountry, uat: boolean): string {
  return uat && country.hasUat
    ? `www2.zuugle.${country.tld}`
    : `www.zuugle.${country.tld}`;
}

export function getDomainName(country: ZuugleCountry, uat: boolean): string {
  return `${uat ? "UAT " : ""}Zuugle.${country.tld}`;
}

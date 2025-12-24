import moment from "moment";

/**
 * @param {string} [domain]
 * @returns {string}
 */
export function get_domain_country(domain) {
    if (domain == null) {
        return "AT"; // domain is undefined or null
    } else if (domain.indexOf("zuugle.de") >= 0) {
        return "DE";
    } else if (domain.indexOf("zuugle.ch") >= 0) {
        return "CH";
    } else if (domain.indexOf("zuugle.it") >= 0) {
        return "IT";
    } else if (domain.indexOf("zuugle.si") >= 0) {
        return "SI";
    } else if (domain.indexOf("zuugle.fr") >= 0) {
        return "FR";
    } else if (domain.indexOf("zuugle.li") >= 0) {
        return "LI";
    } else {
        return "AT"; // localhost and zuugle.at
    }
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isNumber(value) {
    return typeof value === "number";
}

/**
 * @param {string} origin
 * @returns {string}
 */
export function getHost(origin) {
    if (process.env.NODE_ENV === "production") {
        if (origin.length > 0) {
            return `https://${origin}`;
        } else {
            return `https://www.zuugle.at`;
        }
    }
    return "http://localhost:8080";
}

/**
 * @param {string} filePath
 * @returns {string}
 */
export const replaceFilePath = (filePath) => {
    if (!filePath) {
        return filePath;
    }
    return ("" + filePath).split("\\").join("/");
};

export const getAllLanguages = () => {
    return ["en", "de", "it", "fr", "sl"];
};

/**
 * @param {string} datetime
 * @returns {number}
 */
export function minutesFromMoment(datetime) {
    const hours = moment(datetime).get("hour");
    const minutes = moment(datetime).get("minute");
    return hours * 60 + minutes;
}

/**
 * Convert the "difficulty" value into a text value
 * @param {number} difficulty
 * @returns {string}
 */
export const convertDifficulty = (difficulty) => {
    /** @type {Record<number, string>} */
    const map = {
        1: "Leicht",
        2: "Mittel",
        3: "Schwer",
    };

    return map[difficulty] ?? "Unbekannt";
};

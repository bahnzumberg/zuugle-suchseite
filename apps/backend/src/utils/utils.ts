import moment from "moment";

export function get_domain_country(domain?: string) {
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

export function isNumber(value: unknown) {
    return typeof value === "number";
}

export function getHost(origin: string) {
    if (process.env.NODE_ENV === "production") {
        if (origin.length > 0) {
            return `https://${origin}`;
        } else {
            return `https://www.zuugle.at`;
        }
    }
    return "http://localhost:8080";
}

export const replaceFilePath = (filePath: string) => {
    if (!filePath) {
        return filePath;
    }
    return ("" + filePath).split("\\").join("/");
};

export const getAllLanguages = () => {
    return ["en", "de", "it", "fr", "sl"];
};

export function minutesFromMoment(datetime: string) {
    const hours = moment(datetime).get("hour");
    const minutes = moment(datetime).get("minute");
    return hours * 60 + minutes;
}

// convert the "difficulty" value into a text value of types
export const convertDifficulty = (difficulty: number): string => {
    const map: Record<number, string> = {
        1: "Leicht",
        2: "Mittel",
        3: "Schwer",
    };

    return map[difficulty] ?? "Unbekannt";
};

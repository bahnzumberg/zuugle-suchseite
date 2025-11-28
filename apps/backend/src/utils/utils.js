export const round = (value, decimals) => {
    decimals = typeof decimals !== "undefined" ? decimals : 2;
    value = parseFloat(value);
    let val = value < 0 ? value * -1 : value;
    let ret = Number(Math.round(val + "e" + decimals) + "e-" + decimals);
    return value < 0 ? ret * -1 : ret;
};

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

export function isNumber(value) {
    return typeof value === "number";
}

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

export const replaceFilePath = (filePath) => {
    if (!!!filePath) {
        return filePath;
    }
    return ("" + filePath).split("\\").join("/");
};

export const getAllLanguages = () => {
    return ["en", "de", "it", "fr", "sl"];
};

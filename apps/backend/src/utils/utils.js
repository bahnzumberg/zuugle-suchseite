import moment from "moment";

export const round = (value, decimals) => {
    decimals = typeof decimals !== 'undefined' ? decimals : 2;
    value = parseFloat(value);
    let val = (value < 0) ? value * -1 : value;
    let ret = Number(Math.round(val + 'e' + decimals) + 'e-' + decimals);
    return (value < 0) ? ret * -1 : ret;
};

export function listOfDays(startDate, endDate) {
    let dates = [];

    let currDate = moment(startDate).clone().startOf('day');
    let lastDate = moment(endDate).clone().endOf('day');

    while(currDate.diff(lastDate, 'hour') < 0) {
        let toAdd = currDate.clone();
        dates.push(toAdd.format());
        currDate = currDate.add(1, 'days');
    }

    return dates;
};

export function get_domain_country(domain) {
    if (domain.indexOf("zuugle.de") >= 0){
        return "DE";
    } else if(domain.indexOf("zuugle.ch") >= 0){
        return "CH";
    } else if(domain.indexOf("zuugle.it") >= 0){
        return "IT";
    } else if(domain.indexOf("zuugle.si") >= 0){
        return "SI";
    } else if(domain.indexOf("zuugle.fr") >= 0){
        return "FR";
    } else {
        return "AT";
    }
}

export function get_country_lanuage_from_domain(domain) {

    if (domain.indexOf("zuugle.ch") >= 0){
        return ["de","fr","it"];
    } else if(domain.indexOf("zuugle.it") >= 0){
        return ["it"]; 
    } else if(domain.indexOf("zuugle.si") >= 0){
        return ["sl"];
    } else if(domain.indexOf("zuugle.fr") >= 0){
        return ["fr"];
    } else {
        return ["de"];   // for both TLDs .at and .de 
    }
}

export function formatTime(date){
    return !!date ? moment(date).format("HH:mm") : undefined;
}

export function getHost(origin){
    if(process.env.NODE_ENV === "production"){
        return `https://${origin}`;
    }
    return "http://localhost:8080";
}

export const crypt = (salt, text) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

    return text
        .split("")
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join("");
};

export const decrypt = (salt, encoded) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
    return encoded
        .match(/.{1,2}/g)
        .map((hex) => parseInt(hex, 16))
        .map(applySaltToChar)
        .map((charCode) => String.fromCharCode(charCode))
        .join("");
};

export const getWhereFromDomain = (domain) => {
    if(!!domain){
        if(domain.indexOf('zuugle.at') >= 0){
            return {country_at: true}
        } else if(domain.indexOf('zuugle.de') >= 0){
            return {country_de: true}
        } else if(domain.indexOf('zuugle.ch') >= 0){
            return {country_ch: true}
        } else if(domain.indexOf('zuugle.it') >= 0){
            return {country_it: true}
        } else if(domain.indexOf('zuugle.si') >= 0){
            return {country_si: true}
        } else if(domain.indexOf('zuugle.fr') >= 0){
            return {country_fr: true}
        } else {
            return {country_at: true}
        }
    }
    return {country_at: true};
}

export const getTldFromDomain = (domain) => {
    if(domain.indexOf('zuugle.at') >= 0){
        return "AT";
    } else if(domain.indexOf('zuugle.de') >= 0){
        return "DE";
    } else if(domain.indexOf('zuugle.ch') >= 0){
        return "CH";
    } else if(domain.indexOf('zuugle.it') >= 0){
        return "IT";
    } else if(domain.indexOf('zuugle.si') >= 0){
        return "SI";
    } else if(domain.indexOf('zuugle.fr') >= 0){
        return "FR";
    } else {
        return "AT";
    }
}

export const replaceFilePath = (filePath) => {
    if(!!!filePath){
        return filePath;
    }
    return (""+filePath).split("\\").join("/");
}

export const initializeLanguageRanks = () => {
    return [
        {'en' : 1},
        {'de' : 1},
        {'fr' : 1},
        {'it' : 1},
        {'sl' : 1}
    ]
}

export const getAllLanguages = () => {
    return ["en", "de", "it", "fr", "sl"]
}
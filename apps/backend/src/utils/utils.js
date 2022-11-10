import moment from "moment";

export const round = (value, decimals) => {
    decimals = typeof decimals !== 'undefined' ? decimals : 2;
    value = parseFloat(value);
    let val = (value < 0) ? value * -1 : value;
    let ret = Number(Math.round(val + 'e' + decimals) + 'e-' + decimals);
    return (value < 0) ? ret * -1 : ret;
};

export function formatMoney(n, showCurrency = true, c, d, t) {

    var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "," : d,
        t = t == undefined ? " " : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return (showCurrency ? "€ " : "") + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

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
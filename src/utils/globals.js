import moment from "moment";
import useMediaQuery from "@mui/material/useMediaQuery";

export function convertNumToTime(number) {
    // Check sign of given number
    var sign = (number >= 0) ? 1 : -1;

    // Set positive value of number of sign negative
    number = number * sign;

    // Separate the int from the decimal part
    var hour = Math.floor(number);
    var decpart = number - hour;

    var min = 1 / 60;
    // Round to nearest minute
    decpart = min * Math.round(decpart / min);

    var minute = Math.floor(decpart * 60) + '';

    // Add padding if need
    if (minute.length < 2) {
        minute = '0' + minute;
    }

    return `${hour} h ${minute} min`;
}

export function formatNumber(number, postfix = ""){
    return parseFloat(number).toLocaleString('de-AT') + postfix;
}

export function checkIfImageExists(url) {
    const img = new Image();
    img.src = url;

    return new Promise(resolve => {
        if (img.complete) {
            resolve(true);
        } else {
            img.onload = () => {
                resolve(true);
            };

            img.onerror = () => {
                resolve(false);
            };
        }
    })
}

export function updateAllSearchParams(searchParams, values){
    for (const [key, value] of Object.entries(values)) {
        setOrRemoveSearchParam(searchParams, key, value);
    }
}

export function setOrRemoveSearchParam(searchParams, key, value){
    if(!!!value || value == "undefined"){
        searchParams.delete(key);
    } else {
        searchParams.set(key, value)
    }
}

export function formatOnlyTime(date, parsePattern = undefined){
    if(!!parsePattern){
        return moment(date, parsePattern).format("HH:mm");
    }
    return moment(date).format("HH:mm");
}

export function getFilterFromParams(searchParams){
    if(!!searchParams && !!searchParams.get("filter")){
        try {
            const parsed = JSON.parse(searchParams.get("filter"));
            return parsed;
        } catch(e){

        }
    }
}

export const getFilterProp = (filter, key, defaultValue = false) => {
    return !!filter ? filter[key] : defaultValue;
}

export const parseFileName = (name, prefix = "", postfix = "") => {
    let tr = {"ä":"ae", "ü":"ue", "ö":"oe", "ß":"ss" }
    let _name = name.toLowerCase();
    return `${prefix}${_name.replace(/\s/g, '_')}${postfix}`.replace(/[äöüß]/g, function($0) { return tr[$0] });
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


export const getDomainText = () => {
    const host = location.hostname;
    if(host.indexOf('zuugle.at') >= 0) {
        return "Zuugle.at"
    } else if(host.indexOf('zuugle.de') >= 0){
        return "Zuugle.de"
    } else if(host.indexOf('zuugle.ch') >= 0){
        return "Zuugle.ch"
    } else if(host.indexOf('zuugle.it') >= 0){
        return "Zuugle.it"
    } else {
        return "Localhost"
    }
}

export const isResponsive = () => {
    const matches = useMediaQuery('(max-width:600px)');
    return !!matches;
}

export function parseIfNeccessary(value) {
    if(value && value.constructor === "test".constructor){
        value = JSON.parse(value);
    }
    return value;
};

export const getTopLevelDomain = () => {
    let host = window.location.hostname;
    host = host.replaceAll('www2.', '').replaceAll('www.', '');
    return host.substring(host.length-2).toUpperCase();
}

export const myTrackPageView = (pageTitle, trackPageView, city) => {
    let dimensions = [
        {
            id: 1,
            value: getTopLevelDomain(),
        }
    ];

    if(!!city){
        dimensions.push({
            id: 2,
            value: city
        })
    }

    trackPageView({
        documentTitle: pageTitle,
        customDimensions: dimensions
    })
}

export const parseTourConnectionDescription = (connection, field = "connection_description_detail") => {
    if(!!connection){
        return connection[field].split('\n');
    }
    return [];
}

export const getTimeFromConnectionDescriptionEntry = (entry) => {
    let _entry = !!entry ? entry.trim() : null;
    if(!!_entry && _entry.length > 5){
        return _entry.substring(0,5);
    }
    return "";
}

export const getTextFromConnectionDescriptionEntry = (entry) => {
    let _entry = !!entry ? entry.trim() : null;
    if(!!_entry && _entry.length > 5){
        return _entry.substring(5);
    }
    return "";
}

export const titleCase = (string = '') =>{
    if(typeof string === 'string')
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
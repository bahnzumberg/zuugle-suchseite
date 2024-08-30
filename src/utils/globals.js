import moment from "moment";
import useMediaQuery from "@mui/material/useMediaQuery";


export function convertNumToTime(number, nonseparate = false) {
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

    return (!nonseparate) ? `${hour} h ${minute} min` : `${hour}:${minute} h`;
}

export const  simpleConvertNumToTime = (number)=> {
    let timeStr = convertNumToTime(number);
    timeStr = timeStr.replace(/ h/g, '').replace(/ min/g, '');
    if (!timeStr.includes(':')) {
        timeStr = timeStr.replace(/(\d+)\s+(\d+)/, '$1:$2');
    }
    return timeStr;
}

export function formatNumber(number, postfix = ""){
    return parseFloat(number).toLocaleString('de-AT') + postfix;
}


export function setOrRemoveSearchParam(searchParams, key, value){
    if(!!!value || value === "undefined"){
        searchParams.delete(key);
    } else {
        searchParams.set(key, value)
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



export const getDomainText = () => {
    const host = window.location.hostname;
    if(host.indexOf('www.zuugle.at') >= 0) {
        return "Zuugle.at"
    } else if(host.indexOf('www.zuugle.de') >= 0){
        return "Zuugle.de"
    } else if(host.indexOf('www.zuugle.ch') >= 0){
        return "Zuugle.ch"
    } else if(host.indexOf('www.zuugle.li') >= 0){
        return "Zuugle.li"
    } else if(host.indexOf('www.zuugle.it') >= 0){
        return "Zuugle.it"
    } else if(host.indexOf('www.zuugle.fr') >= 0){
        return "Zuugle.fr"
    } else if(host.indexOf('www.zuugle.si') >= 0){
        return "Zuugle.si"
    } else if(host.indexOf('www2.zuugle.at') >= 0){
    return "UAT Zuugle.at"
    } else if(host.indexOf('www2.zuugle.de') >= 0){
        return "UAT Zuugle.de"
    } else if(host.indexOf('www2.zuugle.ch') >= 0){
        return "UAT Zuugle.ch"
    } else if(host.indexOf('www2.zuugle.fr') >= 0){
        return "UAT Zuugle.fr"
    } else if(host.indexOf('www2.zuugle.it') >= 0){
        return "UAT Zuugle.it"
    } else if(host.indexOf('www2.zuugle.si') >= 0){
        return "UAT Zuugle.si"
    } else {
        return "Localhost"
    }
}

export const useResponsive = () => {
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
    return host.substring(host.length-2).toLowerCase();
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


export 	const shortenText = (text, atChar, maxLength) => {
    let shortText = text;
    if(text.length > maxLength){
        shortText = text.slice(atChar, maxLength).concat('...');
    }
    return shortText;
};


// assuming a and b are ordered and equal length arrays; is of O(n) order 
export const orderedArraysEqual = (a,b)=>{
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
       if (a[i] !== b[i] ) return false
    }
    return true
}

export function randomKey(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
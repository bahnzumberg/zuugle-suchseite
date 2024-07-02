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
    if(!!!value || value === "undefined"){
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
            console.log("Error getting filter params")
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
    const host = window.location.hostname;
    if(host.indexOf('www.zuugle.at') >= 0) {
        return "Zuugle.at"
    } else if(host.indexOf('www.zuugle.de') >= 0){
        return "Zuugle.de"
    } else if(host.indexOf('www.zuugle.ch') >= 0){
        return "Zuugle.ch"
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

// export const parseTourConnectionDescription = (connection, field = "connection_description_detail") => {
//     if(!!connection){
//         return connection[field].split('\n');
//     }
//     return [];
// }

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

export 	const shortenText = (text, atChar, maxLength) => {
    let shortText = text;
    if(text.length > maxLength){
        shortText = text.slice(atChar, maxLength).concat('...');
    }
    return shortText;
};

//TODO : add remaining values from filter
//TODO : set values in a dynamic way (calls to the database/ tourActions )
export const defaultFilterValues = [    //index
    {difficulty: 10 },                  // : 0
    {maxAscent: 3000 },                 // : 1
    {minAscent: 0 },                    // : 2
    {maxDescent: 3000 },                // : 3
    {minDescent: 0 },                   // : 4
    {maxDistance: 80 },                 // : 5
    {minDistance: 0 },                  // : 6
    {maxTransportDuration: 6 },         // : 7
    {minTransportDuration: 0.18 },      // : 8
    {ranges_length: 62 },               // : 9
]
export const countFilterActive = (searchParams, filter) => {
    
    let count = 0;

    const _filter = getFilterFromParams(searchParams); //  filter (JS object) extracted from URL filter parameter
    if (!!_filter && !!filter) {
      if (!(!!_filter?.singleDayTour && !!_filter?.multipleDayTour)) {
        count++;
      }
      if (!(!!_filter?.summerSeason && !!_filter?.winterSeason)) {
        count++;
      }
      if (_filter?.difficulty !== 10) {
        count++;
      }
      if (!!_filter?.traverse) {
        count++;
      }
      if (
        _filter?.minAscent > defaultFilterValues[2].minAscent 
        || 
        _filter?.maxAscent < defaultFilterValues[1].maxAscent  

      ) {
        count++;
      }

      if (
        _filter?.minDescent > defaultFilterValues[4].minDescent 
        || 
        _filter?.maxDescent < defaultFilterValues[3].maxDescent 
        
      ) {
        count++;
      }
      if (
        _filter?.minTransportDuration != defaultFilterValues[8].minTransportDuration 
        || 
        _filter?.maxTransportDuration < defaultFilterValues[7].maxTransportDuration 
      ) {
        count++;
      }    
      if (
        _filter?.minDistance > defaultFilterValues[6].minDistance 
        || 
        _filter?.maxDistance < defaultFilterValues[5].maxDistance  
      ) {
        count++;
      }
      if (
        _filter?.ranges?.length !== filter?.ranges?.length) 
        {
        count++;
      }
      if (_filter?.types?.length !== filter?.types?.length) {
        count++;
      }
      if (_filter?.languages?.length !== filter?.languages?.length) {
        count++;
      }
    }
    if(process.env.NODE_ENV !== "production"){
        // consoleLog("L267 : FINAL count :",count)
    }
    return count;
  };



export function urlSearchParamsToObject(searchParams) {
const obj = {};
for (const [key, value] of searchParams) {
    if (obj[key]) {
    if (Array.isArray(obj[key])) {
        obj[key].push(value);
    } else {
        obj[key] = [obj[key], value];
    }
    } else {
    obj[key] = value;
    }
}
return obj;
}

export function consoleLog(textOutput ="output :", varOutput = null, doubleLine = false) {
    if(process.env.NODE_ENV !== "production"){
        if(!!doubleLine){
            console.log("----------------------------")
            console.log(textOutput);
            console.log(varOutput);
            console.log("=============================")
        }else{
            (textOutput && varOutput) ? console.log(textOutput, varOutput) : textOutput ? console.log(textOutput) : console.log(varOutput);  
        }
        return;
    }
    return;
}

export function getMinutesFromDuration(duration) {
    if(!!duration && typeof duration === "string"){
        const [hours, minutes] = duration.split(":").map(Number);
        return hours * 60 + minutes;
    }
    return null
}

export function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}:${remainingMinutes.toString().padStart(2, "0")}`;
}

export const getValuesFromParams = (searchParams)=>{

    let values = {};

    if(!!searchParams){//extract values and add to one data variable
        let city = searchParams.get("city"); 
        let range = searchParams.get("range"); 
        let state = searchParams.get("state"); 
        let country = searchParams.get("country"); 
        let type = searchParams.get("type"); 
        let search = searchParams.get("search");
        let filter = searchParams.get("filter");
        let sort = searchParams.get("sort");
        let provider = searchParams.get("p");
        let map = searchParams.get("map");

        values.city = !!city && city;
        values.range = !!range && range;
        values.search = !!search && search;
        values.state = !!state && state;
        values.country = !!country && country;
        values.type = !!type && type;
        values.provider = !!provider && provider;
        values.sort = !!sort && sort;
        values.map = !!map && map;
        values.filter = !!filter && filter;
    }

    return values
}
  
// is of O(n * m) order
export  const arraysEqual = (a, b) => {
    // console.log("L354 a :", a);
    // console.log("L355 b :", b);
    if (a.length !== b.length) return false;
    for (let id of a) {
        if (!b.includes(id)) return false;
    }
    return true;
};

// assuming a and b are ordered and equal length arrays; is of O(n) order 
export const orderedArraysEqual = (a,b)=>{
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
       if (a[i] !== b[i] ) return false
    }
    return true
}
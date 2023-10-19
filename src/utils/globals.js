import moment from "moment";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSearchParams} from "react-router-dom";



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
    key === "isTraversePossible" && console.log("L88 :: globals / getFilterProp / filter :", filter[key])
    key === "isTraversePossible" && console.log("L89 :: globals / getFilterProp / filter :", filter)
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
    //This is testing code and if statment can be deleted when set for production builds
    // if(process.env.NODE_ENV === "development") {
    //     const domainNames = ['EN', 'DE', 'SL', 'FR', 'IT'];
    //     const randomIndex = Math.floor(Math.random() * domainNames.length);
    //     console.log("randomIndex",domainNames[randomIndex]) ; 
    //     return domainNames[randomIndex];
    // }
    let host = window.location.hostname;
    host = host.replaceAll('www2.', '').replaceAll('www.', '');
    return host.substring(host.length-2).toLowerCase();
    // return host.substring(host.length-2).toUpperCase();
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

export 	const shortenText = (text, atChar, maxLength) => {
    let shortText = text;
    if(text.length > maxLength){
        shortText = text.slice(atChar, maxLength).concat('...');
    }
    return shortText;
};

export const countFilterActive = (searchParams, filter) => {
    //description:
    //The function first retrieves the current filter options from the URL search parameters using getFilterFromParams(searchParams).
    // It initializes a variable called count to 0, which will keep track of the number of active filters.
    // It then checks each filter option to see if it is different from the default filter option. If it is different, it increments the count variable.
    // Finally, the function returns the value of count.

    let count = 0;

    const _filter = getFilterFromParams(searchParams); //  filter (JS object) extracted from URL filter parameter
    console.log(" L214 : _filter :",_filter)
    console.log(" L215 : filter :",filter)
    if (!!_filter && !!filter) {
        console.log("globals / count value: start", count)
      if (!(!!_filter?.singleDayTour && !!_filter?.multipleDayTour)) {
        count++;
        console.log("globals / count value: step 1", count)
      }
      if (!(!!_filter?.summerSeason && !!_filter?.winterSeason)) {
        count++;
        console.log("globals / count value: step 2", count)
      }
      if (_filter?.difficulty != 10) {
        count++;
        console.log("globals / count value: step 3", count)
      }
      if (!!_filter?.children) {
        count++;
        console.log("globals / count value: step 4", count)
      }
      if (!!_filter?.traverse) {
        count++;
        console.log("globals / count value: step 5", count)
      }
      if (
        _filter?.maxAscent != getFilterProp(filter, "maxAscent") ||
        _filter?.minAscent != getFilterProp(filter, "minAscent")
      ) {
        count++;
        console.log("globals / count value: step 6", count)
      }
      if (
        _filter?.maxDescent != getFilterProp(filter, "maxDescent") ||
        _filter?.minDescent != getFilterProp(filter, "minDescent")
      ) {
        count++;
        console.log("globals / count value: step 7", count)
      }
      if (
        _filter?.maxTransportDuration !=
          getFilterProp(filter, "maxTransportDuration") ||
        _filter?.minTransportDuration !=
          getFilterProp(filter, "minTransportDuration")
      ) {
        count++;
        console.log("globals / count value: step 8", count)
      }
      if (
        _filter?.minDistance != getFilterProp(filter, "minDistance") ||
        _filter?.maxDistance != getFilterProp(filter, "maxDistance")
      ) {
        count++;
        console.log("globals / count value: step 9", count)
      }
      if (_filter?.ranges?.length != filter?.ranges?.length) {
        count++;
        console.log("globals / count value: step 10", count)
      }
      if (_filter?.types?.length != filter?.types?.length) {
        count++;
        console.log("globals / count value: step 11", count)
      }
      if (_filter?.languages?.length != filter?.languages?.length) {
        count++;
        console.log("globals / count value: step 12", count)
      }
    }
    console.log("L267 : FINAL count :",count)
    return count;
  };

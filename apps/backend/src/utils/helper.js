import moment from "moment";

export function parseIfNeccessary(value) {
    if(value && value.constructor === "test".constructor){
        value = JSON.parse(value);
    }
    return value;
};

export function paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}

export function asyncPool(poolLimit, array, iteratorFn) {
    let i = 0;
    const ret = [];
    const executing = [];
    const enqueue = function () {
        //Boundary processing, array is an empty array
        if (i === array.length) {
            return Promise.resolve();
        }
        //Initialize a promise every enqueue
        const item = array[i++];
        const p = Promise.resolve().then(() => iteratorFn(item, array));
        //Put into promises array
        ret.push(p);
        //After the promise is executed, remove it from the executing array
        const e = p.then(() => executing.splice(executing.indexOf(e), 1));
        //Insert the executing number to indicate the executing promise
        executing.push(e);
        //Using promise.rece, whenever the number of promises in the executing array is less than poollimit, the new promise is instantiated and executed
        let r = Promise.resolve();
        if (executing.length >= poolLimit) {
            r = Promise.race(executing);
        }
        //Recursion until array is traversed
        return r.then(() => enqueue());
    };
    return enqueue().then(() => Promise.all(ret));
}

export function trimAndSet(value, toSet){
    if (value !== undefined && value.trim().length > 0) {
        toSet = value.trim();
    }
    return toSet;
}

export function generateRandomPassword(length = 10){
    let result = '';
    let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function minutesFromMoment(datetime){
    const hours = moment(datetime).get('hour');
    const minutes = moment(datetime).get('minute');
    return ((hours)*60) + minutes;
}

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

export function hashString(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
};
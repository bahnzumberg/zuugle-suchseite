import moment from "moment";

export function minutesFromMoment(datetime) {
    const hours = moment(datetime).get("hour");
    const minutes = moment(datetime).get("minute");
    return hours * 60 + minutes;
}

export function convertNumToTime(number) {
    // Check sign of given number
    var sign = number >= 0 ? 1 : -1;

    // Set positive value of number of sign negative
    number = number * sign;

    // Separate the int from the decimal part
    var hour = Math.floor(number);
    var decpart = number - hour;

    var min = 1 / 60;
    // Round to nearest minute
    decpart = min * Math.round(decpart / min);

    var minute = Math.floor(decpart * 60) + "";

    // Add padding if need
    if (minute.length < 2) {
        minute = "0" + minute;
    }

    return `${hour} h ${minute} min`;
}

import {getLogoBase64, writePdf} from "./utils";
import {get_image_base64} from "../fileFunctions";
// import {formatTime} from "../utils";
import moment from "moment";
import {convertNumToTime} from "../helper";
import {createSingleImageFromMap} from "../gpx/gpxUtils";
import { convertDifficulty, titleCase } from "../dataConversion";
import logger from "../logger";
import { jsonToStringArray, jsonToText } from "./utils"

export const tourPdf = async ({tour, connection, connectionReturn, connectionReturns, datum, referral = "https://www.zuugle.at"}) => {
    // logger(`L11 , tourPdf.js / tourPdf, value of JSON.stringify(connection) : `);
    // !!connection ? logger(JSON.stringify(connection)) : logger(' NO CONNECION YET ?');
    // logger(`L13 , tourPdf.js / tourPdf, value of JSON.stringify(connection.connection_description_json) : `);
    // !!connection ? logger(JSON.stringify(connection.connection_description_json)) : logger(' NO connection_description_json');
    //logger('L14 connectionReturn :', connectionReturn);
    

    const TEMPLATE = "tour-details";

    tour.difficulty = convertDifficulty(tour.difficulty); //switch from integer values (1,2,3) to text (Leicht, Mittel, Schwer)
    tour.difficulty_orig = titleCase(tour.difficulty_orig)
    let properties = [
        // {title: "Schwierigkeit", value: `${tour.difficulty}/10`}, 
        {title: "Schwierigkeit Zuugle", value: `${tour.difficulty}`}, 
        {title: "Schwierigkeit original", value: `${tour.difficulty_orig}`}, 
        {title: "Sportart", value: `${tour.type}`},
        {title: "Distanz", value: `${tour.distance} km`},
        {title: "Dauer", value: ((!!tour.number_of_days && tour.number_of_days > 1) ? `${tour.number_of_days} Tage` : `${convertNumToTime(tour.duration)}`)},
        {title: "Abstieg", value: `${tour.ascent} hm` },
        {title: "Aufstieg", value: `${tour.descent} hm`},
        // {title: "Kinderfreundlich", value: !!tour.children ? "Ja" : "Nein"},
        {title: "Überschreitung", value: !!tour.traverse ? "Ja" : "Nein"},
    ];


    let _image = null;
    let _imageConnection = null;
    let _imageReturn = null;

    let file = "public/gpx-image/" + tour.provider+"_"+tour.hashed_url + "_gpx.jpg";
    let fileConnection = "public/gpx-image/" + tour.provider+"_"+tour.hashed_url + "_without_tour_gpx.jpg";
    let fileReturn = "public/gpx-image/" + tour.provider+"_"+tour.hashed_url + "_without_tour_gpx.jpg";

 

    if(!!connection && !!connection.totour_track_key){
        fileConnection = await createSingleImageFromMap(tour.provider+"_"+tour.hashed_url, null, connection.totour_track_key, "toTour.html", "_without_tour", false);
    }

    if(!!connectionReturn && !!connectionReturn.fromtour_track_key){
        fileReturn = await createSingleImageFromMap(tour.provider+"_"+tour.hashed_url, connectionReturn.fromtour_track_key, null, "fromTour.html", "_without_tour", false);
    }

    _image = await parseImageToValidBase64(file);
    _imageConnection = await parseImageToValidBase64(fileConnection);
    _imageReturn = await parseImageToValidBase64(fileReturn);


    let connectionEntries = [];

   

    if(!!connection && !!connection.connection_description_json){
        let entries =  jsonToStringArray(connection);
        connectionEntries = createConnectionEntries(entries, connection);
    }

    let allReturn = [];
    if(!!connectionReturns){
        connectionReturns.forEach((cr, index) => {
            let connectionReturnEntries = [];
            if(!!cr && !!cr.return_description_json){
                let entries = jsonToStringArray(cr,'from');
                logger("L80 tourPdf connectionReturns :");
                Array.isArray(entries) &&  logger(" entries is Array....");
                logger(entries)
                // logger("L82 tourPdf cr value = connection ? :");
                // logger(typeof(cr)); // contains already the return_description_parsed inserted
                // logger(JSON.stringify(cr));
                // let jsonEntries = jsonToText(cr,'from');
                // let jsonEntries = jsonToStringArray(cr,'from');
                // logger("L87 tourPdf From json array -> jsonEntries :");
                // Array.isArray(jsonEntries) &&  logger(" jsonEntries is Array....");
                // logger(jsonEntries)
                connectionReturnEntries = createReturnEntries(entries, cr);
                allReturn.push({
                    connectionReturnEntries: connectionReturnEntries,
                    returnText: (() => {
                        return "am " + moment(cr.return_departure_datetime).format("DD.MM.") + " von " + moment(cr.return_departure_datetime).format("HH:mm") + " bis " + moment(cr.return_arrival_datetime).format("HH:mm") + " (" + convertNumToTime(cr.return_duration_minutes / 60) + ")";
                    })(),
                    return_no_of_transfers:  !!cr ? cr.return_no_of_transfers : undefined,
                    index: index+1
                });
            }
        })
    }




    let data = {
        referral,
        properties,
        title: tour.title,
        description: tour.description,
        image: _image,
        imageConnection: _imageConnection,
        imageReturn: _imageReturn,
        datum: moment(datum).format("DD.MM."),
        departureText: (() => {
            if(!!!connection){
                return "";
            }
            return "am " + moment(connection.connection_departure_datetime).format("DD.MM.") + " von " + moment(connection.connection_departure_datetime).format("HH:mm") + " bis " + moment(connection.connection_arrival_datetime).format("HH:mm") + " (" + convertNumToTime(connection.connection_duration_minutes / 60) + ")";
        })(),

        connectionEntries: connectionEntries,
        connectionAllReturns: allReturn,
        return: connectionReturn,
        connection_no_of_transfers: !!connection ? connection.connection_no_of_transfers : undefined,
        logo: getLogoBase64(),
        url: tour.url
    };

    //logger(`L105 tourPdf data is : ${JSON.stringify(data)}`) ; // L105 tourPdf data is : object , this works
    //logger(`L105 tourPdf tour.name is : ${JSON.stringify(tour.name)}`) ; // L105 tourPdf data is : object , this works
    // logger("L105 tourPdf data is :", typeof(data) ); // L105 tourPdf data is : object , this works
    // console.log("L106 tourPdf tour.name is :", tour.name); // this is undefined
    return await writePdf(data, TEMPLATE, false, tour.name + ".pdf", false,  null); // this call works; see the test inside utils.js/writePdf
};

const parseImageToValidBase64 = async (file, contentType = "image/jpeg", resizeWidth = undefined) => {
    // !!file && console.log("L108 / tourPdf / value of file: " + file) // this is working, getting paths to files of real images stored inside gpx-image
    try {
        let _image = await get_image_base64({
            content_type: contentType,
            file: file
        }, resizeWidth);

        if(!!_image){
            _image = `data:image/jpeg;base64,${_image}`
            // console.log("L116, tourPdf _image type: " + typeof(_image))//this is working, got a string value of coded image (when console.logged)
        }

        return _image;
    } catch(e){
        console.error(e);
    }
}


export const createReturnEntries = (entries, connection) => {
    let toReturn = [];
    if(!!entries && entries.length > 0){
        let _entries = entries.filter(e => !!e && e.length > 0);
        let newStart = "     ";
        if(!!connection.totour_track_duration){
            newStart = moment(connection.return_departure_datetime).add(moment(connection['fromtour_track_duration'], 'HH:mm:ss').minutes() * -1, 'minutes');
            if(!!newStart){
                newStart = newStart.format('HH:mm');
            }
        }
        toReturn.push(getDepartureEntry(`${newStart} Ankunft bei Tourende`));

        for(let i=0; i<_entries.length; i++){
            let entry = _entries[i];
            if((i)%2 == 0){
                let _text = entry.trim();
                if(_text.indexOf('|') == 0 || _text.indexOf('=') == 0 || _text.indexOf('>') == 0 || _text.indexOf('<') == 0){
                    _text = _text.substring(1);
                }
                toReturn.push(getDetailEntry(_text, i, _entries.length));
            } else {
                toReturn.push(getStationEntry(entry, ((i+1) == _entries.length)));
            }
        }

    }
    // console.log("L158 toReturn: " + JSON.stringify(toReturn));
    return toReturn;
}
//example of variable "entries" 
//     [
//     "08:02 Wien Meidling",
//     "  |  01:03 Std mit Zug REX9 nach",
//     "09:05 Payerbach-Reichenau Bahnhof",
//     "  =  00:09 Std Umstiegszeit",
//     "09:14 Payerbach-Reichenau Bahnhof",
//     "  |  00:22 Std mit Bus 341 nach",
//     "09:36 Höllental Abzw. Weichtalhaus",
//     "  >  00:02 Std Zustiegsdauer zum Touren-Ausgangspunkt",
//     ""];
// Below is sample output from : "L158 toReturn"
// [
// {"time":"08:14","text":" Baden Bahnhof","firstEntry":true},
// {"time":"","image":"http://localhost:8080/public/icons/ic_transport_train.svg","text":"  00:51 Std mit Zug REX9 nach","middleEntry":true,"detailEntry":true},
// {"time":"09:05","text":" Payerbach-Reichenau Bahnhof","middleEntry":true},
// {"time":"","image":"http://localhost:8080/public/icons/ic_shuffle_black.svg","text":"  00:09 Std Umstiegszeit","middleEntry":true,"detailEntry":true},
// {"time":"09:14","text":" Payerbach-Reichenau Bahnhof","middleEntry":true},
// {"time":"","image":"http://localhost:8080/public/icons/ic_transport_bus.svg","text":"  00:22 Std mit Bus 341 nach","middleEntry":true,"detailEntry":true},
// {"time":"09:36","text":" Höllental Abzw. Weichtalhaus","middleEntry":true},
// {"time":"","image":"http://localhost:8080/public/icons/ic_transport_walk.svg","text":"  00:02 Std Zustiegsdauer zum Touren-Ausgangspunkt","middleEntry":true,"detailEntry":true},
// {"time":"00:02","text":" Ankunft bei Tourstart","lastEntry":true}
// ]

// using the new JSON method described in : 
// https://github.com/bahnzumberg/hermes/wiki/Connection-and-Return-Description ,
// check the file /zuugle-api/test_fahrplan.json for a sample of data
// from jsonb column 'connection_description_json' inside table 'fahrplan'


export const createConnectionEntries = (entries, connection) => {
    let toReturn = [];
    if(!!entries && entries.length > 0){
        let _entries = entries.filter(e => !!e && e.length > 0);
        toReturn.push(getDepartureEntry(_entries[0]));  // e.g. "08:02 Wien Meidling" result: ['08:02', 'Wien Meidling']
        for(let i=1; i<_entries.length; i++){
            let entry = _entries[i];
            if((i-1)%2 == 0){
                let _text = entry.trim();
                if(_text.indexOf('|') == 0 || _text.indexOf('=') == 0 || _text.indexOf('>') == 0){
                    _text = _text.substring(1);
                }
                toReturn.push(getDetailEntry(_text, i, _entries.length));
            } else {
                toReturn.push(getStationEntry(entry, i == _entries.length));
            }
        }
        let newStart = "     ";
        if(!!connection.totour_track_duration){
            newStart = moment(connection.connection_arrival_datetime).add(moment(connection['totour_track_duration'], 'HH:mm:ss').minutes(), 'minutes');
            if(!!newStart){
                newStart = newStart.format('HH:mm');
            }
        }
        toReturn.push(getArrivalEntry(`${newStart} Ankunft bei Tourstart`));
    }
    // console.log("L197 toReturn: " + JSON.stringify(toReturn));

    return toReturn;
}

const getDepartureEntry = (entry) => { // e.g. entry = "08:02 Wien Meidling"
    return {
        time: getTimeFromConnectionDescriptionEntry(entry),
        text: getTextFromConnectionDescriptionEntry(entry),
        firstEntry: true
    }
}

const getArrivalEntry = (entry) => {
    return {
        time: getTimeFromConnectionDescriptionEntry(entry),
        text: getTextFromConnectionDescriptionEntry(entry),
        lastEntry: true
    }
}

const getDetailEntry = (entry) => {
    return {
        time: "",
        image: getIconFromText(entry),
        text: entry,
        middleEntry: true,
        detailEntry: true
    }
}

const getStationEntry = (entry) => {
    return {
        time: getTimeFromConnectionDescriptionEntry(entry),
        text: getTextFromConnectionDescriptionEntry(entry),
        middleEntry: true
    }
}

export const getTimeFromConnectionDescriptionEntry = (entry) => { // e.g. entry = "08:02 Wien Meidling"
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

export const getIconFromText = (text) => {
    let BASE = process.env.NODE_ENV === "production" ? `https://www.zuugle.at/public/icons/` 
    :                                                  `http://localhost:8080/public/icons/`;
    if (!!text && (text.indexOf(' Zug ') >= 0 || text.indexOf(' U-Bahn ') >= 0)) {
        return BASE + "ic_transport_train.svg";
    } else if (!!text && text.indexOf(' Straßenbahn ') >= 0) {
        return BASE + "ic_transport_tram.svg";
    }  else if (!!text && text.indexOf(' Bus ') >= 0) {
        return BASE + "ic_transport_bus.svg";
    } else if (!!text && text.indexOf(' Taxi ') >= 0) {
        return BASE + "ic_transport_car.svg"
    } else if (!!text && text.indexOf('Umstiegszeit') >= 0) {
        return BASE + "ic_shuffle_black.svg";
    } else if(!!text && text.toLowerCase().indexOf('seilbahn') >= 0){
        return BASE + "ic_transport_seilbahn.svg";
    } else {
        return BASE + "ic_transport_walk.svg";
    }
}
// Description:
// This code exports a function named tourPdf that generates a PDF file with details about a tour.
// The function takes an object as an argument, which contains information about the tour and some related data, such as connections, returns, and the referral.
// The function starts by defining a constant TEMPLATE, which is a string with the value "tour-details".  
// The code then defines an array properties, which contains information about the tour, such as its difficulty, type, distance, duration, ascent, descent, whether it's suitable for children, and whether it's a traverse.
// The function then declares some variables that will hold the base64-encoded image data of the tour and its connections/returns.
// It then creates the file paths for the images of the tour, the connection, and the returns. The code creates the images of the tour and the connection by calling the createSingleImageFromMap function with the relevant parameters, while the return images are not created in this code.
// The function then calls the parseImageToValidBase64 function to convert the images to base64-encoded format, and stores the results in the variables declared earlier.
// The code then processes the connection description detail and creates an array connectionEntries of connection details.
// It then processes the return description detail and creates an array allReturn of return details.
// Finally, the code creates an object data with all the information and data needed to generate the PDF, and returns it.

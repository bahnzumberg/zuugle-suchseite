import {getLogoBase64, writePdf} from "./utils";
import {get_image_base64} from "../fileFunctions";
import {formatTime} from "../utils";
import moment from "moment";
import {convertNumToTime} from "../helper";
import {createSingleImageFromMap} from "../gpx/gpxUtils";

export const tourPdf = async ({tour, connection, connectionReturn, connectionReturns, datum, referral = "https://www.zuugle.at"}) => {
    const TEMPLATE = "tour-details";

    if (tour.difficulty == 1) { let _difficulty='leicht' }
    else if (tour.difficulty == 2) { let _difficulty='mittel' }
    else if (tour.difficulty == 3) { let _difficulty='schwer' }
    else { let _difficulty='nicht gesetzt' }

    let properties = [
        {title: "Schwierigkeit", value: `${_difficulty}`},
        {title: "Sportart", value: `${tour.type}`},
        {title: "Distanz", value: `${tour.distance} km`},
        {title: "Dauer", value: ((!!tour.number_of_days && tour.number_of_days > 1) ? `${tour.number_of_days} Tage` : `${convertNumToTime(tour.duration)}`)},
        {title: "Abstieg", value: `${tour.ascent} hm` },
        {title: "Aufstieg", value: `${tour.descent} hm`},
        {title: "Kinderfreundlich", value: !!tour.children ? "Ja" : "Nein"},
        {title: "Überschreitung", value: !!tour.traverse ? "Ja" : "Nein"},
    ];


    let _image = null;
    let _imageConnection = null;
    let _imageReturn = null;

    let file = "public/gpx-image/" + tour.provider+"_"+tour.hashed_url + "_gpx.jpg";
    let fileConnection = "public/gpx-image/" + tour.provider+"_"+tour.hashed_url + "_without_tour_gpx.jpg";
    let fileReturn = "public/gpx-image/" + tour.provider+"_"+tour.hashed_url + "_without_tour_gpx.jpg";

    //Auf Basiskarte wird nur noch die Tour angezeigt, wodurch kein neues JPEG erzeugt werden muss.
    /*if((!!connectionReturn && !!connectionReturn.fromtour_track_key) || (!!connection && !!connection.totour_track_key)){
        file = await createSingleImageFromMap(tour.provider+"_"+tour.hashed_url, connectionReturn.fromtour_track_key, connection.totour_track_key);
    }*/

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
    if(!!connection && !!connection.connection_description_detail){
        let entries = connection.connection_description_detail.split('\n');
        connectionEntries = createConnectionEntries(entries, connection);
    }


    let allReturn = [];
    if(!!connectionReturns){
        connectionReturns.forEach((cr, index) => {
            let connectionReturnEntries = [];
            if(!!cr && !!cr.return_description_detail){
                let entries = cr.return_description_detail.split('\n');
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

    return await writePdf(data, TEMPLATE, false, tour.name + ".pdf", false,  null);
};

const parseImageToValidBase64 = async (file, contentType = "image/jpeg", resizeWidth = undefined) => {
    try {
        let _image = await get_image_base64({
            content_type: contentType,
            file: file
        }, resizeWidth);

        if(!!_image){
            _image = `data:image/jpeg;base64,${_image}`
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
    return toReturn;
}

export const createConnectionEntries = (entries, connection) => {
    let toReturn = [];
    if(!!entries && entries.length > 0){
        let _entries = entries.filter(e => !!e && e.length > 0);
        toReturn.push(getDepartureEntry(_entries[0]));
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
    return toReturn;
}

const getDepartureEntry = (entry) => {
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

export const getIconFromText = (text) => {
    let BASE = process.env.NODE_ENV === "production" ? `https://www.zuugle.at/public/icons/` : `http://localhost:8080/public/icons/`;
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
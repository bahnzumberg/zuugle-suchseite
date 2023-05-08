export const tourTypes = [
    "wandern",
    "schneeschuh",
    "skitour",
    "langlaufen",
    "bike & Hike",
    "klettern",
    "klettersteig",
    "rodeln",
    "weitwandern",
];

const daysDE = ['MO','DI','MI','DO','FR','SA','SO'];
const daysSL = ['PO', 'TO', 'SR', 'ČE', 'PE', 'SO', 'NE'];
const daysEN = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
const daysIT = ['LU', 'MA', 'ME', 'GI', 'VE', 'SA', 'DO'];
const daysFR = ['LU', 'MA', 'ME', 'JE', 'VE', 'SA', 'DI'];


export const localMissingDays = (daysArr, lng) => {

    // daysArr !== [] ? console.log("daysArr :", daysArr) : console.log("daysArr is falsy");
    //description
    // daysArr contains the days in text short form e,g. ['MON', 'DI']
    // the lng is the language we want to transform into e.g. 'en'
    // Loop through daysArray and match each item to the corresponding day string value
    // in the stdArray belonging to language lng, filling an intermediate temporary array

    //initialise
    let retDays = [];
    let stdArray = []; 

    // define which language array to use
    if (lng === 'de') stdArray =  daysDE; 
    if (lng === 'en') stdArray =  daysEN; 
    if (lng === 'sl') stdArray =  daysSL; 
    if (lng === 'it') stdArray =  daysIT; 
    if (lng === 'fr') stdArray =  daysFR; 

    // iterate over the given array of days (daysArr is in German)
    daysArr.map((day)=>{
        //description
        //find index of day => indexOf(day) within daysDE (being our base language)
        //using same index push the value inside the stdArray to retDays
        
        const tempInd = daysDE.indexOf(day.toUpperCase()); 
        if (tempInd > -1) retDays.push(stdArray[tempInd]);

    })
    return retDays;

}


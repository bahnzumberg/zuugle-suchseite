import React from "react";
import i18n  from "i18next";

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
//used for creating links to pass as object values to the attribute "components" in Trans 
export const LinkText = (props) => {
    return (
        <a href={props.to || '#'} target="_blank" title={props.title || ''}>
            {props.children}
        </a>
    );
};
// SET LANGUAGE UPON ENTRY
// 1:   IF localStorage(“lang”) exists   then:
//             IF i18n.resolvedLanguage != localStorage("lang")  [change to a new language ]
//                  then let lang=localStorage("lang") be as current set language as such : i18n.changeLanguage(lang);
//             else [both localStorage(“lang”) AND current resolved are the same]
//                  DO nothing
//      else if localStorage(“lang”) DOES NOT exist
//          then FIND lang which is a seperate function extractLanguage() to pass on to 'lang' string variable and do i18n.changeLanguage(lang)   

//const extractLanguage = () =>{ 
//      1. getTopLevelDomain() and return the TLD
//      2. make the axios call to the backend passing the TLD
//      3. return the language string from the call, (e.g., 'en', 'fr', 'de', etc.)
//      4. If no language is available, you can return a default language code.
//}


function extractLanguage() {
    const languages = ['en', 'de', 'sl', 'fr', 'it'];
    const randomIndex = Math.floor(Math.random() * languages.length);
    console.log("randomIndex",randomIndex) ; // 2. second clg executed -> page entry with no localStorage (gives a value)
    return languages[randomIndex];
}
// 3. third clg executed (inside Start.js) -> will give "curLocalLanguage : X " , X being whatever language was created by extractLanguage()
export function setLanguage() {
  const storedLanguage = localStorage.getItem('lang');
  console.log("storedLanguage",storedLanguage)  // 1. first clg executed -> page entry with no localStorage gives value = null

  if (storedLanguage) {
    if (i18n.resolvedLanguage !== storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  } else {
    const lang = extractLanguage();
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  }
}


export default setLanguage;
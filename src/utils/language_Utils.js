import React from "react";
import i18n from "i18next";
import axios from "../axios";
import { getTopLevelDomain } from "./globals";

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

const daysDE = ["MO", "DI", "MI", "DO", "FR", "SA", "SO"];
const daysSL = ["PO", "TO", "SR", "ČE", "PE", "SO", "NE"];
const daysEN = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
const daysIT = ["LU", "MA", "ME", "GI", "VE", "SA", "DO"];
const daysFR = ["LU", "MA", "ME", "JE", "VE", "SA", "DI"];

export const localMissingDays = (daysArr, lng) => {
	//description
	// daysArr contains the days in text short form e,g. ['MON', 'DI']
	// the lng is the language we want to transform into e.g. 'en'
	// Loop through daysArray and match each item to the corresponding day string value
	// in the stdArray belonging to language lng, filling an intermediate temporary array

	//initialise
	let retDays = [];
	let stdArray = [];

	// define which language array to use
	if (lng === "de") stdArray = daysDE;
	if (lng === "en") stdArray = daysEN;
	if (lng === "sl") stdArray = daysSL;
	if (lng === "it") stdArray = daysIT;
	if (lng === "fr") stdArray = daysFR;

	// iterate over the given array of days (daysArr is in German)
	daysArr.map((day) => {
		//description
		//find index of day => indexOf(day) within daysDE (being our base language)
		//using same index push the value inside the stdArray to retDays

		const tempInd = daysDE.indexOf(day.toUpperCase());
		if (tempInd > -1) retDays.push(stdArray[tempInd]);
	});
	return retDays;
};

//LinkText could be used for creating links to pass as object values to the attribute "components" in Trans of i18next
export const LinkText = (props) => {
	return (
		<a href={props.to || "#"} target="_blank" title={props.title || ""}>
			{props.children}
		</a>
	);
};
// Logic description: SET LANGUAGE UPON ENTRY
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

export function langChange(language) {
	i18n.changeLanguage(language, function () {
		// Trigger the custom event to notify index.html about the language change
		var event = new CustomEvent("languageChanged", {
			detail: { language: language },
		});
		document.dispatchEvent(event);
	});
}

const extractLanguage = async () => {
	let tld = getTopLevelDomain();
	tld = tld == "ST" ? "AT" : tld; // localhost gives a value of 'ST' so make default 'AT'
	// console.log("TLD :", tld);
	try {
		const response = await axios.get("/language", {
			params: {
				tld: tld,
			},
		});
		const language = response.data.language;
		// console.log("Extracted language from server:", language);
		return language || "en"; // Return the language received from the backend or fallback to a default language code
	} catch (error) {
		if (error.response) {
			// Req was made but server returned an error (status code ?)
			console.error(
				"Server error, retrieving extracted lang:",
				error.response.data
			);
		} else if (error.request) {
			// no response was received / but req was made
			console.error("Error retrieving extracted lang: No response received");
		} else {
			// Error in setting up the request
			console.error("Request error retrieving extracted lang:", error.message);
		}
		return "en"; // Return a default language code in case of error
	}
};

export async function setLanguage() {
	// setup for index.html file

	const storedLanguage = localStorage.getItem("lang");
	// console.log("Utils: storedLanguage", storedLanguage);

	let newResolved = i18n.services.languageUtils.formatLanguageCode(
		i18n.resolvedLanguage
	);
	// console.log("Utils: newResolved", newResolved);

	if (storedLanguage) {
		if (newResolved !== storedLanguage) {
			langChange(storedLanguage);
			// i18n.changeLanguage(storedLanguage);
		}
	} else {
		try {
			const extractedLang = await extractLanguage();
			console.log("Utils: extractedLang:", extractedLang);

			const formattedLang =
				i18n.services.languageUtils.formatLanguageCode(extractedLang);
			console.log("Utils: formattedLang:", formattedLang);

			// i18n.changeLanguage(formattedLang);
			langChange(formattedLang);
			localStorage.setItem("lang", formattedLang);

			// Set the formatted language as the value in the SelectInput component
			// setLanguageValue(formattedLang);
		} catch (error) {
			// Handle the error and set a fallback language?
			console.error("Error retrieving extracted lang:", error);
		}
	}
}

//https://github.com/i18next/i18next/issues/1927
//https://github.com/i18next/i18next-browser-languageDetector#detector-options

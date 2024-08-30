import React from "react";
import i18n from "i18next";
import axios from "../axios";
import { getTopLevelDomain } from "./globals";

export const tourTypes = [
	"wandern",
	"schneeschuh",
	"skitour",
	"langlaufen",
	"bike_hike",
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
	// daysArr contains the days in text short form e,g. ['MON', 'DI']
	// the lng is the language we want to transform into e.g. 'en'
	// Loop through daysArray and match each item to the corresponding day string value
	// in the stdArray belonging to language lng, filling an intermediate temporary array

	let retDays = [];
	let stdArray = [];

	// define which language array to use
	if (lng === "de") stdArray = daysDE;
	if (lng === "en") stdArray = daysEN;
	if (lng === "sl") stdArray = daysSL;
	if (lng === "it") stdArray = daysIT;
	if (lng === "fr") stdArray = daysFR;

	// iterate over the given array of days (daysArr is in German so we use daysDE)
	daysArr.map((day) => {
		const tempInd = daysDE.indexOf(day.toUpperCase());
		if (tempInd > -1) retDays.push(stdArray[tempInd]);
	});
	return retDays;
};


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
	try {
		const response = await axios.get("/language", {
			params: {
				tld: tld,
			},
		});
		const language = response.data.language;

		return language || "en"; // Return language received from the backend or fallback to a default
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


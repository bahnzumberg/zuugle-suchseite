import * as React from 'react';
import Box from "@mui/material/Box";
import {Grid, Typography} from "@mui/material";
import {Helmet} from "react-helmet";
import { useTranslation } from 'react-i18next';


//ToDo: Translate meta content in getPageHeader
export const getPageHeader = (directLink) => {
    const {t} = useTranslation();

    //console.log("directLink :", directLink) // seems to be always on null value 
    if(!!directLink && !!directLink.header){
        return <Helmet>
            <title>{directLink.header}</title>
            <meta name="title" content={directLink.header} />
            <meta name="description" content={directLink.description} />
        </Helmet>
    } else {
        return <Helmet>
            <title>{t("start.helmet_title")}</title>
            <meta name="title" content="Zuugle - die Suchmaschine für Öffi-Bergtouren" />
            <meta name="description" content="Zuugle zeigt dir geprüfte Verbindungen mit Bahn und Bus zu Bergtouren, Wanderungen, Skitouren, Schneeschuhwanderungen, etc. von deinem Wohnort aus an." />
        </Helmet>
    }
    // return <></>
}

export const checkIfSeoPageCity = (location, cities) => {
    //console.log("seoPageHelper: location : " + location) // /suche
    //console.log("seoPageHelper: cities.length : " + cities.length) // 37 (exists)
    if(!!location && !!location.pathname && location.pathname == "/suche"){
        return null;
    } else if(!!location && !!location.pathname && cities.length > 0){
        //description:
        // If location is null or pathname is null or undefined or the path is not a city path, the function returns null.
        // If a city is found in the cities array that matches the value of the path name, the function returns an object representing the found city.
        // If no city is found in the cities array that matches the value of the path name, the function returns undefined.
        const found = cities.find(city => city.value == location.pathname.substring(1));
        return found;
    } else {
        return null;
    }
}

export const checkIfSeoPageRange = (location, ranges) => {
    if(!!location && !!location.pathname && location.pathname == "/suche"){
        return null;
    } else if(!!location && !!location.pathname && ranges.length > 0){
        const found = ranges.find(range => range.range_slug == parseRangeFromUrl(location.pathname.substring(1)));
        return found;
    } else {
        return null;
    }
}

//description
//This function, listAllCityLinks, takes in an array of cities and an optional searchParams object. It then maps over the array of cities and generates links for each city with appropriate URL parameters. Finally, it returns a JSX element containing a grid of city links wrapped in a Box with a Typography element for the title. If the cities argument is falsy, it returns an empty array.
export const listAllCityLinks = (cities, searchParams = null) => {
    const {t} = useTranslation();

    const country = translatedCountry();

    if(!!cities){
        const entries = cities.map((city,index) => {
            let link = `${city.value}`;
            if(!!searchParams && !!searchParams.get('p')){
                link = `${link}?p=${searchParams.get('p')}`
            }
            return <Grid key={index} item xs={12} sm={6} md={4} ><a href={`/${link}`} className={"seo-city-link"}>{city.label}</a></Grid>
        });
        return <Box sx={{textAlign: "left"}}>
                <Typography variant={"h4"} sx={{marginBottom: "20px"}}>
                    <>                           
                        {t('start.heimatbahnhoefe_in')} 
                        {" "}
                        {country}
                    </> 
                </Typography>
            <Grid container>
                {entries}
            </Grid>
        </Box>
    }
    return [];
}

export const listAllRangeLinks = (ranges, searchParams = null) => {
    const {t} = useTranslation();
    const country = translatedCountry();

    if(!!ranges){
        const entries = ranges.map((range,index) => {
            let link = `${range.range_slug}`;
            if(!!searchParams && !!searchParams.get('p')){
                link = `${link}?p=${searchParams.get('p')}`
            }
            return <Grid key={index} item xs={12} sm={6} md={4}><a href={`/${parseRangeToUrl(link)}`} className={"seo-city-link"}>{range.range}</a></Grid>
        });

        return <Box sx={{textAlign: "left"}}>
            <Typography variant={"h4"} sx={{marginBottom: "20px"}}>
                <>                           
                    {t('start.wanderdestinationen')}
                    {" "} 
                    {country}
                </>  
                </Typography>
            <Grid container>
                {entries}
            </Grid>
        </Box>
    }
    return [];
}


const translatedCountry =()=>{

    const {t} = useTranslation();
    const country =  getCountryName(); 
    const countryKey = getCountryKey(country);
    
    return t(`start.${countryKey}`);
}



const getCountryKey = (name) => {

    switch (name) {
        case name === "der Schweiz":
            return "schweiz";
        case name === "Österreich":
            return "oesterreich";
        case name === "Deutschland":
            return "deutschland";
        case name === "Frankreich":
            return "frankreich";
        default:
            return "oesterreich";
    }
}

const getCountryName = () => {
    let host = location.hostname;
    if(host.indexOf('zuugle.ch') >= 0){
        return "der Schweiz"
    } else if(host.indexOf('zuugle.de') >= 0){
        return "Deutschland"
    } else if(host.indexOf('zuugle.it') >= 0){
        return "Italien"
    } else if(host.indexOf('zuugle.fr') >= 0){
        return "Frankreich"
    } else if(host.indexOf('zuugle.si') >= 0){
        return "Slowenien"
    } else {
        return "Österreich";
    }
}

const parseRangeFromUrl = (text) => {
    return decodeURI(text);
}

const parseRangeToUrl = (text) => {
    return encodeURI(text);
}
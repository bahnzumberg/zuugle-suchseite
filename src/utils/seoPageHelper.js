import * as React from 'react';
import Box from "@mui/material/Box";
import {Grid, Typography} from "@mui/material";
import {Helmet} from "react-helmet";

export const getPageHeader = (directLink) => {
    if(!!directLink && !!directLink.header){
        return <Helmet>
            <title>{directLink.header}</title>
            <meta name="title" content={directLink.header} />
            <meta name="description" content={directLink.description} />
        </Helmet>
    } else {
        return <Helmet>
            <title>Zuugle - die Suchmaschine für Öffi-Bergtouren</title>
            <meta name="title" content="Zuugle - die Suchmaschine für Öffi-Bergtouren" />
            <meta name="description" content="Zuugle zeigt dir geprüfte Verbindungen mit Bahn und Bus zu Bergtouren, Wanderungen, Skitouren, Schneeschuhwanderungen, etc. von deinem Wohnort aus an." />
        </Helmet>
    }
    // return <></>
}

export const checkIfSeoPageCity = (location, cities) => {
    console.log(location.pathname)
    if(!!location && !!location.pathname && location.pathname == "/suche"){
        return null;
    } else if(!!location && !!location.pathname && cities.length > 0){
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

export const listAllCityLinks = (cities, searchParams = null) => {
    if(!!cities){
        const entries = cities.map((city,index) => {
            let link = `${city.value}`;
            if(!!searchParams && !!searchParams.get('p')){
                link = `${link}?p=${searchParams.get('p')}`
            }
            return <Grid key={index} item xs={12} sm={6} md={4} ><a href={`/${link}`} className={"seo-city-link"}>{city.label}</a></Grid>
        });

        return <Box sx={{textAlign: "left"}}>
            <Typography variant={"h4"} sx={{marginBottom: "20px"}}>Heimatbahnhöfe in {getCountryName()}</Typography>
            <Grid container>
                {entries}
            </Grid>
        </Box>
    }
    return [];
}

export const listAllRangeLinks = (ranges, searchParams = null) => {
    if(!!ranges){
        const entries = ranges.map((range,index) => {
            let link = `${range.range_slug}`;
            if(!!searchParams && !!searchParams.get('p')){
                link = `${link}?p=${searchParams.get('p')}`
            }
            return <Grid key={index} item xs={12} sm={6} md={4}><a href={`/${parseRangeToUrl(link)}`} className={"seo-city-link"}>{range.range}</a></Grid>
        });

        return <Box sx={{textAlign: "left"}}>
            <Typography variant={"h4"} sx={{marginBottom: "20px"}}>Die schönsten Wanderdestinationen in {getCountryName()}</Typography>
            <Grid container>
                {entries}
            </Grid>
        </Box>
    }
    return [];
}

const getCountryName = () => {
    let host = location.hostname;
    if(host.indexOf('zuugle.ch') >= 0){
        return "der Schweiz"
    } else if(host.indexOf('zuugle.de') >= 0){
        return "Deutschland"
    } else if(host.indexOf('zuugle.it') >= 0){
        return "Italien"
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
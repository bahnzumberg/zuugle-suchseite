import * as React from 'react';
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import {Fragment, useState} from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import ChevronRightLight from "../../icons/ChevronRight";
import CircularProgress from "@mui/material/CircularProgress";

export function CityResultList({cities, setCity, setCityInput, onFocusCity, isCityLoading, loadRegions, loadFavouriteTours, setOpenCitySearch, searchParams, setSearchParams, showNotFoundEntry = true, onSelect}){
    const [sliceCities, setSliceCities] = useState(true);

    const renderLinksBasedOnHost = () => {
        let host = location.hostname;
        if(host.indexOf('zuugle.at') >= 0){
            return <Fragment>
                {generateLinkEntry("https://www.zuugle.de", "zuugle.de", "Bahnhöfe in Deutschland")}
                {generateLinkEntry("https://www.zuugle.ch", "zuugle.ch", "Bahnhöfe in der Schweiz")}
                {generateLinkEntry("https://www.zuugle.it", "zuugle.it", "Bahnhöfe in Italien")}
            </Fragment>
        } else if(host.indexOf('zuugle.de') >= 0){
            return <Fragment>
                {generateLinkEntry("https://www.zuugle.at", "zuugle.at", "Bahnhöfe in Österreich")}
                {generateLinkEntry("https://www.zuugle.ch", "zuugle.ch", "Bahnhöfe in der Schweiz")}
                {generateLinkEntry("https://www.zuugle.it", "zuugle.it", "Bahnhöfe in Italien")}
            </Fragment>
        } else if(host.indexOf('zuugle.ch') >= 0){
            return <Fragment>
                {generateLinkEntry("https://www.zuugle.at", "zuugle.at", "Bahnhöfe in Österreich")}
                {generateLinkEntry("https://www.zuugle.de", "zuugle.de", "Bahnhöfe in Deutschland")}
                {generateLinkEntry("https://www.zuugle.it", "zuugle.it", "Bahnhöfe in Italien")}
            </Fragment>

        } else if(host.indexOf('zuugle.it') >= 0){
            return <Fragment>
                {generateLinkEntry("https://www.zuugle.at", "zuugle.at", "Bahnhöfe in Österreich")}
                {generateLinkEntry("https://www.zuugle.de", "zuugle.de", "Bahnhöfe in Deutschland")}
                {generateLinkEntry("https://www.zuugle.de", "zuugle.ch", "Bahnhöfe in der Schweiz")}
            </Fragment>
        }  else {
            return <Fragment>
                {generateLinkEntry("https://www.zuugle.at", "zuugle.at", "Bahnhöfe in Österreich")}
                {generateLinkEntry("https://www.zuugle.de", "zuugle.de", "Bahnhöfe in Deutschland")}
                {generateLinkEntry("https://www.zuugle.ch", "zuugle.ch", "Bahnhöfe in der Schweiz")}
                {generateLinkEntry("https://www.zuugle.it", "zuugle.it", "Bahnhöfe in Italien")}

            </Fragment>
        }
    }

    const generateLinkEntry = (url, linkText, label) => {
        console.log("L54 : URL passed to list item",url)
        console.log("L55 : linkText passed to list item",linkText)
        console.log("L56 : label passed to list item",label)
        return  <ListItem
            onMouseDown={() => {window.location.href = url}} //sets up a redirect to the specified URL when the mouse button is pressed down on the ListItem.
            sx={{borderBottom: "1px solid #ECECEC"}}
            className={"cursor-link"}
            secondaryAction={
                <IconButton edge="end" aria-label="go" onMouseDown={() => {window.location.href = url}}>
                    <Typography>{linkText}</Typography>
                    <ChevronRightLight />
                </IconButton>
            }>
            <ListItemText
                primary={label}
            />
        </ListItem>
    }

    const notFoundEntry = () => {
        return  <ListItem className={"not-found-entry"}>
            <ListItemText
                primary={
                    <Typography>
                        <Typography sx={{fontWeight: 800}}>Deinen nahegelegenen Bahnhof nicht gefunden?</Typography>
                        <Typography sx={{maxWidth: "700px"}}>Wir erweitern laufend die verfügbaren Ausgangspunkte und die Touren.</Typography>
                    </Typography>
                }
            />
        </ListItem>
    }

    const writeCityToLocalStorage = (city) => {
        localStorage.setItem('city', city);
    }

    let _cities = (!!cities && cities.length > 5 && !!sliceCities) ? cities.slice(0, 5) : cities;

    return <List>
        {(!!isCityLoading && false) &&
        <ListItem sx={{backgroundColor: "#FFFFFF"}}>
            <Box sx={{padding: "20px"}}>
                <CircularProgress />
            </Box>
        </ListItem>
        }

        {(!!_cities ? _cities : []).map((_city,index) => {
            return <ListItem
                key={index}
                onMouseDown={(event) => {
                    setCity(_city);
                    setCityInput(_city.label);
                    if(!!onFocusCity){
                        onFocusCity(false);
                    }
                    if(!!onSelect){
                        onSelect(_city);
                    }

                    searchParams.set('city', _city.value);
                    setSearchParams(searchParams);

                    //load regions initially
                    loadRegions({city: _city.value});

                    //wenn startseite lade touren
                    if(!!_city && !!_city.value){
                        loadFavouriteTours({sort: "relevanz", city: _city.value, limit: 10, ranges: true});
                        writeCityToLocalStorage(_city.value);
                    }
                }}
                sx={{borderBottom: "1px solid #ECECEC", paddingLeft: "20px", cursor: "pointer"}}
                secondaryAction={
                    <IconButton edge="end" aria-label="go">
                        <ChevronRightLight />
                    </IconButton>
                }>
                <ListItemText
                    primary={_city.label}
                />
            </ListItem>
        })}
        {
            (!!cities && cities.length > 5 && !!sliceCities) && <ListItem
                sx={{borderBottom: "1px solid #ECECEC", paddingLeft: "20px", cursor: "pointer"}}
            >
                <ListItemText
                    onMouseDown={() => {
                        setSliceCities(false);
                        setTimeout(() => {
                            setOpenCitySearch(true);
                        }, 10)
                    }}
                    color={"#4992FF"}
                    secondary={`${cities.length - 5} weitere einblenden`}
                    secondaryTypographyProps={{
                        color: '#4992FF',
                    }}
                />
            </ListItem>
        }

        <ListItem sx={{backgroundColor: "#F4F4F4"}}>
            <ListItemText
                secondary={"NICHT FÜNDIG GEWORDEN?"}
            />
        </ListItem>
        {renderLinksBasedOnHost()}
        {!!showNotFoundEntry && notFoundEntry()}
    </List>
};
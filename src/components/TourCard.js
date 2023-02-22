import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import TourConnectionCard from "./TourConnectionCard";
import CustomStarRating from "./CustomStarRating";
import {checkIfImageExists, convertNumToTime, formatNumber} from "../utils/globals";
import Clock from "../icons/Clock";
import Intensity from "../icons/Intensity";
import Walk from "../icons/Walk";
import ArrowHorizontal from "../icons/ArrowHorizontal";
import ArrowVertical from "../icons/ArrowVertical";
import {Fragment, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import TourConnectionCardNew from "./TourConnectionCardNew";
import TourConnectionReturnCardNew from "./TourConnectionReturnCardNew";
import useMediaQuery from "@mui/material/useMediaQuery";

const DEFAULT_IMAGE = '/app_static/img/train_placeholder.webp';

export default function TourCard({tour, onSelectTour, loadTourConnections, city}){

    const [image, setImage] = useState(DEFAULT_IMAGE);
    const [imageOpacity, setImageOpacity] = useState(1)

    const [connectionLoading, setConnectionLoading] = useState(true)
    const [connections, setConnections] = useState([]);
    const [returns, setReturns] = useState([]);

    useEffect(() => {

        if(!!tour.image_url && tour.provider==='bahnzumberg'){
            checkIfImageExists(tour.image_url).then(exists => {
                if(!!exists){
                    setImage(tour.image_url);
                } else if(!!tour.gpx_image_file_small){
                    checkIfImageExists(tour.gpx_image_file_small).then(gpxExists => {
                        if(!!gpxExists){
                            setImage(tour.gpx_image_file_small);
                        } else {
                            setImage(DEFAULT_IMAGE);
                        }
                    })
                }
            })
        } else if(!!tour.gpx_image_file_small){
            checkIfImageExists(tour.gpx_image_file_small).then(gpxExists => {
                if(!!gpxExists){
                    setImage(tour.gpx_image_file_small);
                } else {
                    setImage(DEFAULT_IMAGE);
                }
            })
        } else {
            setImage(DEFAULT_IMAGE);
        }
    }, [tour])

    useEffect(() => {
        if(!!loadTourConnections && !!city && tour.cities && tour.cities.length > 0){
            setConnectionLoading(true);
            loadTourConnections({id: tour.id, city: city}).then(res => {
                // console.log("Line 65 TourCard:",res.data)
                setConnectionLoading(false);
                setConnections(res.data.connections);
                setReturns(res.data.returns);
            })
        } else if(!!!city){
            setConnections([]);
            setReturns([]);
        }
    }, [tour])

    const shortened_url = () => {
        const isMobile = useMediaQuery('(max-width:600px)');
        let length = 45;
        if (!!isMobile) { 
            length = 35; 
        } 
        let red_url = (!!tour.url?tour.url:"").replace("https://www.", "").replace("http://www.", "").split("/"), i;
        let final_url = red_url[0];
        
        for (i = 1; i < red_url.length-1; i++) {
            if (final_url.length + red_url[i].length <= length) {
                final_url = final_url + " > " + red_url[i]
            }
            else {
                return final_url;
            }
        }

        return final_url;
    }

    const renderProps = () => {
        const values = [];
        if(!!tour){
            values.push({
                icon: <Clock style={{fill: "transparent"}}/>,
                text: "Tour: " + ((!!tour.number_of_days && tour.number_of_days > 1) ? (tour.number_of_days + ' Tage') : convertNumToTime(tour.total_tour_duration)),
            });
            values.push({
                icon: <Intensity style={{fill: "transparent"}} />,
                text: tour.difficulty,
            })
            values.push({
                icon: <Walk style={{fill: "transparent"}} />,
                text: tour.type,
            })
            values.push({
                icon: <ArrowVertical style={{fill: "transparent"}} />,
                text: tour.ascent + " / "+  tour.descent + " hm",
            })
            values.push({
                icon: <ArrowHorizontal style={{fill: "transparent"}} />,
                text: formatNumber(tour.distance, " km"),
            });
        }

        return <Typography display="inline" style={{whiteSpace: "break-spaces"}}>{values.map((entry,index) => {
            return <Box key={index} display="inline-block" sx={{marginRight: "10px"}}>
                {entry.icon}
                <Typography display={"inline"} variant={"subtitle2"} sx={{lineHeight: "24px", position: "relative", top: "-7px", left: "4px"}}>{entry.text}</Typography>
            </Box>
        })}</Typography>;
    }

    const getConnectionReturnList = () => {
        if(!!returns && returns.length > 0){
            return returns.map((r,index) => {
                return <Box key={index} style={{display: "inline-block", marginRight: "20px"}}>
                    <TourConnectionCard departureStop={r.connection_returns_departure_stop} datetimeString={r.return_departure_arrival_datetime_string}/>
                </Box>
            })
        } else {
            return <Fragment></Fragment>
        }
    }

    const getAnreise = () => {
        if(!!connections && connections.length > 0){
            let connection = connections[0];
            return <TourConnectionCardNew connection={connection}/>
        } else {
            return <Fragment></Fragment>
        }
    }

    const getAbreise = () => {
        if(!!returns && returns.length > 0){
            return <Box sx={{marginTop: "10px"}}>
                <TourConnectionReturnCardNew returns={returns}/>
            </Box>
        } else {
            return <Fragment></Fragment>
        }
    }


    return  <Card className="tour-card cursor-link" onClick={() => {
        onSelectTour(tour)}}>
        <CardMedia
            component="img"
            height="140"
            image={image}
            style={{opacity: imageOpacity}}
        />
        <CardContent>
            <CustomStarRating ratings={200} ratingValue={tour.user_rating_avg}/>
            <div className="mt-3">
                <Typography variant="h5">{tour.range}</Typography>
            </div>
            <div className="mt-3">
                <Typography variant="h4" style={{whiteSpace: "break-spaces"}}>{tour.title}</Typography>
                <Typography variant="h5" style={{whiteSpace: "break-spaces"}}>{shortened_url()}</Typography>
            </div>
            <div className="mt-3" style={{whiteSpace: "break-space"}}>
                {renderProps()}
            </div>



        </CardContent>
        {(!!connections && connections.length > 0) && <Fragment>
            <div className="bottom-container">
                <CardContent>
                    {!!connectionLoading ? <Box sx={{padding: "20px"}}>
                        <LinearProgress />
                    </Box> : <Fragment>
                        {getAnreise()}
                        {getAbreise()}
                    </Fragment>
                    }
                </CardContent>
            </div>
        </Fragment>
        }

    </Card>
}
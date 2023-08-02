import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
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
import { useTranslation } from 'react-i18next';
import {tourTypes} from "../utils/language_Utils";

const DEFAULT_IMAGE = '/app_static/img/train_placeholder.webp';

//description
// This component is used to display detailed information about a tour and its associated connections.
//detailed information:
//It imports various components and icons from the @mui/material library and some custom components and utility functions.
// The component takes in several props such as tour, onSelectTour, loadTourConnections, and city. It uses the useState hook to keep track of the state of various variables such as image, imageOpacity, connectionLoading, connections, and returns. It also uses the useEffect hook to fetch and set the image, connections, and returns based on the tour and city props.
// The renderProps() function returns an array of JSX elements that contain information about the tour such as its duration, difficulty, type, distance, and ascent/descent. 
// The component also includes a shortened_url() function which returns a shortened version of the URL for the tour.
export default function TourCard({tour, onSelectTour, loadTourConnections, city}){

    const [image, setImage] = useState(DEFAULT_IMAGE);
    const [imageOpacity, setImageOpacity] = useState(1)   //FAL: why is this a state if it is set only once?

    const [connectionLoading, setConnectionLoading] = useState(true)
    const [connections, setConnections] = useState([]);
    const [returns, setReturns] = useState([]);

    // i18next
    const {t} = useTranslation();

    //description
    //search tour-related image in folders and set image state to it , otherwise set state to DEFAULT_IMAGE
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
                //clg
                // console.log("Line 74 TourCard:",res.data.connections)
                // console.log("Line 75 TourCard:",res.data.returns)
                // console.log("Line 75 TourCard:",res.data)
                setConnectionLoading(false);
                setConnections(res?.data?.connections);
                setReturns(res?.data?.returns);
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

        const translateDiff = (diff) =>{
            if(diff === "Leicht"){
                return t('start.leicht');
            }else if(diff === "Schwer") {
                return t('start.schwer');
            }else return t('start.mittel');
        };

        const translateTourType = (type) =>{
            let translatedType = null; 
            tourTypes.map((typ)=>{
                type = type.toLowerCase();
                if(typ === type){   //correct the small cap so both can be equal
                    // console.log("filter.${type} : ", `filter.${type}`)
                    translatedType = t(`filter.${type}`)
                }
            })
            return translatedType;
        };


        const values = [];
        if(!!tour){
            values.push({
                icon: <Clock style={{fill: "transparent"}}/>,
                text: "Tour: " + ((!!tour.number_of_days && tour.number_of_days > 1) ? (tour.number_of_days + ' Tage') : convertNumToTime(tour.total_tour_duration)),
            });
            values.push({
                icon: <Intensity style={{fill: "transparent"}} />,
                text: translateDiff(tour.difficulty),
                // text: tour.difficulty,
            })
            values.push({
                icon: <Walk style={{fill: "transparent"}} />,
                text: translateTourType(tour.type),
                // text: tour.type,
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

        return <Box display="inline" style={{whiteSpace: "break-spaces"}}>{values.map((entry,index) => {
            return <Box key={index} display="inline-block" sx={{marginRight: "10px"}}>
                {entry.icon}
                <Typography display={"inline"} variant={"subtitle2"} sx={{lineHeight: "24px", position: "relative", top: "-7px", left: "4px"}}>{entry.text}</Typography>
            </Box>
        })}</Box>;
    }


    const getAnreise = () => {
        if(!!connections && connections.length > 0){
            let connection = connections[0];
            // console.log("TourCard connection: ") ;
            // console.log(connection)
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


    return (
      <Card
        className="tour-card cursor-link"
        onClick={() => {
          onSelectTour(tour);
        }}
      >
        <CardMedia
          component="img"
          height="140"
          image={image}
          style={{ opacity: imageOpacity }}
        />
        <CardContent>
          <CustomStarRating ratings={200} ratingValue={tour.user_rating_avg} />
          <div className="mt-3">
            <Typography variant="h5">{tour.range}</Typography>
          </div>
          <div className="mt-3">
            <Typography variant="h4" style={{ whiteSpace: "break-spaces" }}>
              {tour.title}
            </Typography>
            <Typography variant="h5" style={{ whiteSpace: "break-spaces" }}>
              {shortened_url()}
            </Typography>
          </div>
          <div className="mt-3" style={{ whiteSpace: "break-space" }}>
            {renderProps()}
          </div>
        </CardContent>
        
        {!!connections && connections.length > 0 && (
          <Fragment>
            <div className="bottom-container">
              <CardContent>
                {!!connectionLoading ? (
                  <Box sx={{ padding: "20px" }}>
                    <LinearProgress />
                  </Box>
                ) : (
                  <Fragment>
                    {getAnreise()}
                    {getAbreise()}
                  </Fragment>
                )}
              </CardContent>
            </div>
          </Fragment>
        )}
        
      </Card>
    );
}

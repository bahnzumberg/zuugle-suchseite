import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CustomStarRating from "../CustomStarRating";
import {checkIfImageExists, convertNumToTime, formatNumber} from "../../utils/globals";
import Clock from "../../icons/Clock";
import Intensity from "../../icons/Intensity";
import Walk from "../../icons/Walk";
import ArrowHorizontal from "../../icons/ArrowHorizontal";
import ArrowVertical from "../../icons/ArrowVertical";
import {Fragment, useEffect, useState} from "react";
import Box from "@mui/material/Box";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTranslation } from 'react-i18next';
import {tourTypes} from "../../utils/language_Utils";
import { useSearchParams } from 'react-router-dom';
// import {consoleLog} from "../../utils/globals";

const DEFAULT_IMAGE = '/app_static/img/train_placeholder.webp';

export default function PopupCard({tour}){

    const [image, setImage] = useState(DEFAULT_IMAGE);
    const [searchParams, setSearchParams] = useSearchParams();

    if(searchParams.get('filter')) searchParams.delete("filter");
    if(searchParams.get('map')) searchParams.delete("map");
 
    let tourLink = `/tour?id=${tour.id}&`+ searchParams.toString();
      
    // i18next
    const {t} = useTranslation();

    const hm = t("details.hm_hoehenmeter");
    const km = t("details.km_kilometer");

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


    const isMobile_600px = useMediaQuery('(max-width:600px)');
    if(isMobile_600px){
        let iconStyle = { fill: "transparent", width: '25px', height: '25px' }
    }


    const shortened_url = () => {
        let length = 45;
        if (!!isMobile_600px) { 
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
            tourTypes.forEach((typ)=>{
                type = type.toLowerCase();
                if(typ === type){   //correct the small cap so both can be equal
                    // console.log("filter.${type} : ", `filter.${type}`)
                    translatedType = t(`filter.${type}`)
                }
            })
            return translatedType;
        };


        const values = [];
        if (tour) {
            values.push({
                icon: <Clock style={{ fill: "transparent", width: '25px', height: '25px' }} />, 
                text: `${t("main.tour")}: ` + ((tour.number_of_days && tour.number_of_days > 1) ? (tour.number_of_days + ` ${t("details.tage")}`) : convertNumToTime(tour.total_tour_duration)),
            });
            values.push({
                icon: <Intensity style={{ fill: "transparent", width: '20px', height: '20px' }} />, 
                text: translateDiff(tour.difficulty),
            });
            values.push({
                icon: <Walk style={{ fill: "transparent", width: '20px', height: '20px' }} />, 
                text: translateTourType(tour.type),
            });
            values.push({
                icon: <ArrowVertical style={{ fill: "transparent", width: '20px', height: '20px' }} />, 
                text: `${tour.ascent} / ${tour.descent} ${hm}`,
            });
            values.push({
                icon: <ArrowHorizontal style={{ fill: "transparent", width: '20px', height: '20px' }} />, 
                text: `${formatNumber(tour.distance, ` ${km}`)}`,
            });
        }

        return (
            <Box display="inline" style={{ 
                whiteSpace: "break-spaces", 
                fontSize: '12px' ,
                }}> 
                {values.map((entry, index) => (
                    <Box key={index} display="inline-block" sx={{ marginRight: "10px" }}
                        style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        }}
                    > 
                        {entry.icon}
                        <Typography display="inline" variant="subtitle2" sx={{ fontSize: '14px', marginLeft:'4px'}}> 
                            {entry.text}
                        </Typography>
                    </Box>
                ))}
            </Box>
        );
    };


    return (
      <Card
        className="tour-card-map"
      >
        <a href={tourLink} target='_blank' rel='noreferrer' className='cursor-link'>
            <CardMedia
             component="img"
             height="100"
             image={image}
             // Ensuring the image fits within the width and maintains aspect ratio
             style={{ opacity: 1, width: "100%", maxHeight: "100px", objectFit: "cover" }}
            />
        </a>
        <CardContent sx={{ padding: '8px' }}>
            <Typography variant="h6" sx={{ fontSize: '16px' }}>{tour.range}</Typography> 
            <Typography variant="h5" sx={{ fontSize: '14px', whiteSpace: "break-spaces" }}> 
                <a href={tourLink} target='_blank' rel='noreferrer' className="custom-h5-link curser-link">
                    {tour.title}
                </a>
            </Typography>
            <Typography variant="h6" sx={{ fontSize: '12px', whiteSpace: "break-spaces" }}> 
                <a href={tourLink} target='_blank' rel='noreferrer' className="custom-h6-link curser-link">
                    {shortened_url()}
                </a>
            </Typography>
            <Box mt={1} style={{ whiteSpace: "break-space" }}> 
                {renderProps()}
            </Box>
        </CardContent>
      </Card>
    );
}

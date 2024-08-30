import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {convertNumToTime} from "../../utils/globals";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';


const DEFAULT_IMAGE = '/app_static/img/train_placeholder.webp';

function isNumber(value) {
  return typeof value === 'number';
}

export default function PopupCard({tour, city}){

    const [image, setImage] = useState(DEFAULT_IMAGE);
    const [searchParams, setSearchParams] = useSearchParams();

    if(searchParams.get('filter')) searchParams.delete("filter");
    if(searchParams.get('map')) searchParams.delete("map");
 
    let tourLink = `/tour/${tour.id}/${city}`;
      
    // i18next
    const {t} = useTranslation();

    const hm = t("details.hm_hoehenmeter");
    // const km = t("details.km_kilometer");

    //description
    //search tour-related image in folders and set image state to it , otherwise set state to DEFAULT_IMAGE
    useEffect(() => {
        if(!!tour.gpx_image_file_small && !!gpxExists){
            setImage(tour.gpx_image_file_small);
        } else {
            setImage(DEFAULT_IMAGE);
        }
    }, [tour])

    const isMobile_600px = useMediaQuery('(max-width:600px)');

    let value_best_connection_duration = tour.min_connection_duration;
    let value_connection_no_of_transfers = tour.min_connection_no_of_transfers;
    if (!isNumber(value_connection_no_of_transfers)) {
      value_connection_no_of_transfers = 'N/A'
    }
    let value_avg_total_tour_duration = tour.avg_total_tour_duration;
     
    
      return (
        <Card
          className="tour-card"
          style={{ position: "relative" }}
        >   
          <CardContent>
            <div
              className="mt-1"
              style={{
                display: "flex",
                gap: "10px",
                paddingBottom: "5px",
                alignItems: "center",
              }}
            >
              <img
                src={`/app_static/icons/provider/logo_${tour.provider}.svg`}
                alt={tour.provider_name}
                style={{ borderRadius: "100%", height: "13px", width: "13px" }}
              />
              <Typography variant="grayP">{tour.provider_name}</Typography>
            </div>
            <div className="mt-1" style={{ marginBottom: "40px", width: "100%" }}>
              <Typography  style={{ whiteSpace: "break-space" , fontSize: "10px"}}>
                <a
                  href={tourLink}
                  target="_blank"
                  rel="noreferrer"
                  className="updated-title curser-link"
                >
                  {tour.title}
                </a>
              </Typography>
            </div>
            {/* <div className="mt-3" style={{ whiteSpace: "break-space" }}>
              {renderProps()}
            </div> */}
            <Box
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                width: "100%",
                gap: "4px",
                position: "absolute",
                bottom: "15px",
              }}
            >
              <Typography
                variant="blueP"
                style={{ borderRight: "1px solid #DDDDDD" , fontSize: "13px"}}
              >
                  {t("details.anreisedauer")} <br/>
                {
                    !!value_best_connection_duration ? 
                    <>
                        <span style={{ fontSize: "13px" }}>
                        {convertNumToTime(value_best_connection_duration/60, true)}
                        </span>
                    </>
                    :
                    <div className='mt-2'>
                        N/A
                    </div>
                }
              </Typography>
              <Typography
                variant="blueP"
                style={{ borderRight: "1px solid #DDDDDD", display: "block", fontSize: "13px" }}
              >
                {t("start.umstiege")} <br />
                {
                    <span style={{ fontSize: "13px" }}>{value_connection_no_of_transfers}</span>
                }
              </Typography>
    
              <Typography
                variant="blackP"
                style={{ borderRight: "1px solid #DDDDDD" , fontSize: "13px"}}
              >
                {t("main.dauer")} <br />
                <span style={{ fontSize: "13px" }}>{
                !(tour?.number_of_days) ?
                "N/A"
                :
                (tour?.number_of_days > 1) ? 
                (tour?.number_of_days + " " + t('details.tage')) 
                : 
                convertNumToTime(value_avg_total_tour_duration, true)}
                </span>
              </Typography>
    
              <Typography variant="blackP" styles={{ fontSize: "13px"}}>
                {t("filter.anstieg")} <br />
                <span style={{ fontSize: "13px" }}>{tour.ascent} {hm}</span>
              </Typography>
            </Box>
          </CardContent>    
        </Card>
      );
}

import * as React from 'react';
import {Typography} from "@mui/material";
import {convertNumToTime, formatNumber} from "../utils/globals";

const TourDetailProperties = ({tour}) => {

    console.log(tour);

    return <div className="tour-detail-properties">
        <div className="tour-detail-properties-el">
            <Typography variant={"infoKey"}>Sportart</Typography>
            <Typography variant={"h5alt"}>{tour?.type}</Typography>
        </div>
        <div className="tour-detail-properties-el">
            <Typography variant={"infoKey"}>Tourdauer</Typography>
            <Typography variant={"h5alt"}>{(tour?.number_of_days > 1) ? (tour?.number_of_days + "days") : convertNumToTime(tour?.total_tour_duration, true)}</Typography>
        </div>
        <div className="tour-detail-properties-el">
            <Typography variant={"infoKey"}>Distanz</Typography>
            <Typography variant={"h5alt"}>{formatNumber(tour?.distance) + ' km'}</Typography>
        </div>
        <div className="tour-detail-properties-el">
            <Typography variant={"infoKey"}>Max. Höhe</Typography>
            <Typography variant={"h5alt"}>{tour?.max_ele || "-"}</Typography>
        </div>
        <div className="tour-detail-properties-el">
            <Typography variant={"infoKey"}>Aufstieg</Typography>
            <Typography variant={"h5alt"}>{formatNumber(tour?.ascent, ' hm')}</Typography>
        </div>
        <div className="tour-detail-properties-el">
            <Typography variant={"infoKey"}>Abstieg</Typography>
            <Typography variant={"h5alt"}>{formatNumber(tour?.descent, ' hm')}</Typography>
        </div>
    </div>;
}

export default TourDetailProperties;
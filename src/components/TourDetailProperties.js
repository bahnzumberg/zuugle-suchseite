import * as React from 'react';
import {Typography} from "@mui/material";

const TourDetailProperties = ({tour}) => {

    console.log(tour);

    return <div className="tour-detail-properties">
        <div className="tour-detail-properties-el">
            <Typography  variant={"text"}>Sportart</Typography>
            <Typography  variant={"h5alt"}>{tour?.type}</Typography>
        </div>
        <div className="tour-detail-properties-el">
            <Typography  variant={"text"}>Tourdauer</Typography>
            <Typography  variant={"h5alt"}>{tour?.duration}</Typography>
        </div>
        <div className="tour-detail-properties-el">
            <Typography  variant={"text"}>Distanz</Typography>
            <Typography  variant={"h5alt"}>{tour?.distance}</Typography>
        </div>
        <div className="tour-detail-properties-el">
            <Typography  variant={"text"}>Max. Höhe</Typography>
            <Typography  variant={"h5alt"}>{tour?.max_ele || "-"}</Typography>
        </div>
        <div className="tour-detail-properties-el">
            <Typography  variant={"text"}>Aufstieg</Typography>
            <Typography  variant={"h5alt"}>{tour?.ascent}</Typography>
        </div>
        <div className="tour-detail-properties-el">
            <Typography  variant={"text"}>Abstieg</Typography>
            <Typography  variant={"h5alt"}>{tour?.descent}</Typography>
        </div>
    </div>;
}

export default TourDetailProperties;
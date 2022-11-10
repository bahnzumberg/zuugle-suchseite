import * as React from 'react';
import Typography from '@mui/material/Typography';

export default function TourConnectionCard({departureStop, datetimeString}){
    return <div className="tour-connection-card">
        <Typography variant="subtitle1" className="station">{departureStop}</Typography>
        <Typography variant="subtitle2" className="time">{datetimeString}</Typography>
    </div>;
}

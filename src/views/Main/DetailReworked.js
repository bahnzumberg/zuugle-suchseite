import * as React from 'react';
import {useEffect, useState} from 'react';
import Footer from "../../components/Footer/Footer";
import SearchContainer from "../Start/SearchContainer";
import InteractiveMap from "../../components/InteractiveMap";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useSearchParams} from "react-router-dom";
import {loadTour, loadTourConnections, loadTourConnectionsExtended, loadTours} from "../../actions/tourActions";
import {compose} from "redux";
import {connect} from "react-redux";
import {loadGPX} from "../../actions/fileActions";
import gpxParser from "gpxparser";


const setGpxTrack = (url, loadGPX, _function) => {
    loadGPX(url).then(res => {
        if (!!res && !!res.data) {
            let gpx = new gpxParser(); //Create gpxParser Object
            gpx.parse(res.data);
            if (gpx.tracks.length > 0) {
                const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon]);
                _function(positions);
            }
        }
    })
}

const DetailReworked = ({loadTour, loadTours, loadTourConnections, loadTourConnectionsExtended, loadGPX}) => {

    console.log(loadTour);

    const [tour, setTour] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [gpxPositions, setGpxPositions] = useState(null);
    const [anreiseGpxPositions, setAnreiseGpxPositions] = useState(null);
    const [abreiseGpxPositions, setAbreiseGpxPositions] = useState(null);

    useEffect(() => {
        const tourId = searchParams.get("id");
        const city = searchParams.get("city");
        if (tourId && !tour) {
            console.log(tourId, tour);
            loadTour(tourId, city)
                .then(res => {
                    console.log(res?.data?.tour);
                    setTour(res?.data?.tour);
                });
        }
    }, []);

    useEffect(() => {
        if (tour) {
            setGpxTrack(tour.gpx_file, loadGPX, setGpxPositions);
            setGpxTrack(tour.totour_gpx_file, loadGPX, setAnreiseGpxPositions);
            setGpxTrack(tour.fromtour_gpx_file, loadGPX, setAbreiseGpxPositions);
        }
    }, [!!tour]); // Nicki ?

    return <>
        <SearchContainer goto={"/suche"}/>
        {(window?.selectedTour) && <div>
            <pre>{JSON.stringify(window?.selectedTour, null, 2)}</pre>
        </div>}
        <Box sx={{padding: 3}}>
            <Box className="mt-3">
                <Typography variant="h5">{tour?.range}</Typography>
            </Box>
            <Box className="mt-3">
                <Typography variant="h4">{tour?.title}</Typography>
            </Box>
        </Box>
        <div>
            <Box sx={{width: "100%", position: "relative", height: 300}}>
                <InteractiveMap gpxPositions={gpxPositions} anreiseGpxPositions={anreiseGpxPositions}
                                abreiseGpxPositions={abreiseGpxPositions}/>
            </Box>
        </div>
        <div>

        </div>
        <Footer></Footer>
    </>;
}

const mapDispatchToProps = {
    loadTour,
    loadTours,
    loadTourConnections,
    loadTourConnectionsExtended,
    loadGPX,
};

function mapStateToProps(state) {
    return {
        // isPdfLoading: state.tours.isPdfLoading,
        // isGpxLoading: state.tours.isGpxLoading
    }
}

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
)(DetailReworked)

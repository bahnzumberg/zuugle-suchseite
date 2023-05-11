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
import {Chip, Divider} from "@mui/material";
import TourDetailProperties from "../../components/TourDetailProperties";


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
        console.log('HALLO');
        if (tour) {
            setGpxTrack(tour.gpx_file, loadGPX, setGpxPositions);
            setGpxTrack(tour.totour_gpx_file, loadGPX, setAnreiseGpxPositions);
            setGpxTrack(tour.fromtour_gpx_file, loadGPX, setAbreiseGpxPositions);
        }
    }, [!!tour]); // Nicki ?

    return <Box sx={{"background-color": "#FFFFFF"}}>
        <Box sx={{background: "#4992FF"}}>

        <SearchContainer goto={"/suche"}/>
        </Box>
        <Box>
            <Box sx={{padding: 3, "text-align": "left"}}>
                <Box className="mt-3">
                    <Typography variant="h4">{tour?.title}</Typography>
                </Box>
                <Box className="mt-3">
                    <span className="tour-detail-tag" >{tour?.range}</span>
                </Box>
            </Box>
            <div>
                <Box sx={{width: "100%", position: "relative", height: 300}}>
                    <InteractiveMap gpxPositions={gpxPositions} anreiseGpxPositions={anreiseGpxPositions}
                                    abreiseGpxPositions={abreiseGpxPositions}/>
                </Box>
                <div className="tour-detail-data-container">
                    <TourDetailProperties tour={tour}></TourDetailProperties>
                    <Box sx={{"text-align": "left"}}>
                        <div class="tour-detail-difficulties">
                            <Typography variant="h5alt">{tour?.difficulty_orig}</Typography>
                            <span className="tour-detail-tag tour-detail-tag-gray" >{tour?.difficulty}</span>
                        </div>
                        <Typography variant="textSmall">{tour?.description}</Typography>
                    </Box>
                    <div className="tour-detail-provider-container">
                        <div className="tour-detail-provider-icon"></div>
                        <div  className="tour-detail-provider-name-link">
                            <span className="tour-detail-provider-name">{tour?.provider_name}</span>
                            <span className="tour-detail-provider-link">{tour?.url}</span>
                        </div>
                    </div>
                    <Divider variant="middle" />
                    <div className="tour-detail-img-container">
                        <img
                            src={tour?.image_url}
                            alt="image"
                        />
                    </div>
                </div>
            </div>
            <div>

            </div>
        </Box>
        <Footer></Footer>
    </Box>;
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

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
import GpxParser from "gpxparser";
import moment from "moment/moment";

const setGpxTrack = (url, loadGPX, _function) => {
    loadGPX(url).then(res => {
        if (!!res && !!res.data) {
            let gpx = new GpxParser(); //Create gpxParser Object
            gpx.parse(res.data);
            if (gpx.tracks.length > 0) {
                const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon]);
                _function(positions);
            }
        }
    })
}

const DetailReworked = ({
                            loadTour,
                            loadTours,
                            loadTourConnections,
                            loadTourConnectionsExtended,
                            loadGPX,
                            loadTourGpx,
                            isGpxLoading,
                            loadTourPdf,
                            isPdfLoading
                        }) => {

    console.log(loadTour);

    const [tour, setTour] = useState(null);
    const [connections, setConnections] = useState(null);
    const [activeConnection, setActiveConnection] = useState(null);
    const [currentDate, setCurrentDate] = useState(null);
    const [activeConnectionIndex, setActiveConnectionIndex] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [gpxPositions, setGpxPositions] = useState(null);
    const [anreiseGpxPositions, setAnreiseGpxPositions] = useState(null);
    const [abreiseGpxPositions, setAbreiseGpxPositions] = useState(null);

    useEffect(() => {
        const tourId = searchParams.get("id");
        const city = searchParams.get("city");

        setCurrentDate(moment().format("YYYY-MM-DD"));

        if (tourId && !tour) {
            console.log(tourId, tour);
            loadTour(tourId, city)
                .then(res => {
                    console.log(res?.data?.tour);
                    setTour(res?.data?.tour);
                });
        }

        if (tourId && city && !connections) {
            loadTourConnectionsExtended({id: tourId, city: city}).then(res => {
                if (!!res && !!res.data) {
                    setConnections(res.data.result);
                    setActiveConnectionIndex(0);
                }
            })
        }
    }, []);

    useEffect(() => {
        if (tour) {
            setGpxTrack(tour.gpx_file, loadGPX, setGpxPositions);
            setGpxTrack(tour.totour_gpx_file, loadGPX, setAnreiseGpxPositions);
            setGpxTrack(tour.fromtour_gpx_file, loadGPX, setAbreiseGpxPositions);
        }
    }, [!!tour]);

    useEffect(() => {
        setActiveConnection(getConnectionFromIndex())
    }, [activeConnectionIndex]);

    const getConnectionFromIndex = () => {
        if(!!connections && connections.length > activeConnectionIndex){
            let entry = connections[activeConnectionIndex];
            if(!!entry && entry.connections && entry.connections.length > 0){
                return entry.connections[0];
            }
        }
        return null;
    }


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
        <div>
            <pre>All connections: {JSON.stringify(connections?.length)}</pre>
            <pre>Active connection index: {JSON.stringify(activeConnectionIndex)}</pre>
            <pre>Active connection: {JSON.stringify(activeConnection?.id)}</pre>
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
        isPdfLoading: state.tours.isPdfLoading,
        isGpxLoading: state.tours.isGpxLoading
    }
}

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
)(DetailReworked)

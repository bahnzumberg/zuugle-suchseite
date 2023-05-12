import * as React from 'react';
import {useEffect, useState} from 'react';
import Footer from "../../components/Footer/Footer";
import SearchContainer from "../Start/SearchContainer";
import InteractiveMap from "../../components/InteractiveMap";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useSearchParams} from "react-router-dom";
import {
    loadTour,
    loadTourConnectionsExtended,
    loadTourGpx,
    loadTours,
    loadTourPdf
} from "../../actions/tourActions";
import {compose} from "redux";
import {connect} from "react-redux";
import {loadGPX} from "../../actions/fileActions";
import gpxParser from "gpxparser";
import {Chip, Divider} from "@mui/material";
import TourDetailProperties from "../../components/TourDetailProperties";
import moment from "moment/moment";
import {Buffer} from "buffer";
import fileDownload from "js-file-download";
import {parseFileName} from "../../utils/globals";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ProviderLogo from "../../icons/ProviderLogo";
import DownloadIcon from "../../icons/DownloadIcon";
import PdfIcon from "../../icons/PdfIcon";

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
    const [activeReturnConnection, setActiveReturnConnection] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [gpxPositions, setGpxPositions] = useState(null);
    const [anreiseGpxPositions, setAnreiseGpxPositions] = useState(null);
    const [abreiseGpxPositions, setAbreiseGpxPositions] = useState(null);

    const date = moment().format("YYYY-MM-DD");

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

        if (tourId && city && !connections) {
            loadTourConnectionsExtended({id: tourId, city: city}).then(res => {
                if (res && res.data) {
                    setConnections(res.data.result);
                    setActiveConnection(res.data.result[0].connections[0]); // TODO
                    setActiveReturnConnection(res.data.result[0].returns[0]); // TODO
                }
            })
        }
    }, []);

    useEffect(() => {
        console.log('HALLO');
        if (tour) {
            setGpxTrack(tour.gpx_file, loadGPX, setGpxPositions);
            setGpxTrack(tour.totour_gpx_file, loadGPX, setAnreiseGpxPositions);
            setGpxTrack(tour.fromtour_gpx_file, loadGPX, setAbreiseGpxPositions);
        }
    }, [!!tour]);

    async function onDownload() {
        try {
            const response = await loadTourPdf({
                id: tour?.id,
                connection_id: !!activeConnection ? activeConnection.id : undefined,
                connection_return_id: !!activeReturnConnection ? activeReturnConnection.id : undefined,
                connection_return_ids: (!!connections[0].returns ? connections[0].returns.map(e => e.id) : []),
                date
            }) // TODO change to currently selected index
            // handle response here
            if (response) {
                let pdf = undefined;
                if (!!response.data) {
                    response.data = JSON.parse(response.data);
                    if (!!response.data.pdf) {
                        pdf = response.data.pdf
                    }
                    ;
                } else if (!response.data || !response.data.pdf) {
                    console.log("no response")
                }

                if (!!pdf) {
                    const fileName = response.data.fileName ? response.data.fileName : "";
                    const buf = Buffer.from(pdf, 'base64');
                    fileDownload(buf, fileName, "application/pdf");
                }
            } else {
                console.log("no response is returned")
            }
        } catch (error) {
            console.log('error : ', error)
        }
    }


    const onDownloadGpx = () => {
        if (!!activeReturnConnection && activeReturnConnection.fromtour_track_key && !!activeConnection && !!activeConnection.totour_track_key) {
            loadTourGpx({
                id: tour.id,
                key_anreise: activeConnection.totour_track_key,
                key_abreise: activeReturnConnection.fromtour_track_key,
                type: "all"
            }).then((res) => {
                    if (!!res && !!res.data) {
                        fileDownload(res.data, parseFileName(tour.title, "zuugle_", ".gpx"));
                    }
                },
                (err) => {
                    console.log('error: ', err)
                });
        } else {
            loadTourGpx({id: tour.id}).then((res) => {
                    if (!!res && !!res.data) {
                        fileDownload(res.data, parseFileName(tour.title, "zuugle_", ".gpx"));
                    }
                },
                (err) => {
                    console.log('error: ', err)
                });
        }
    }

    const downloadButtonsDisabled = () => {
        return !!!tour || !!!tour.gpx_file || !!!activeConnection || !!!activeConnection.totour_track_key || !!!activeReturnConnection || !!!activeReturnConnection.fromtour_track_key;
    }


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
                    <span className="tour-detail-tag">{tour?.range}</span>
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
                        <div className="tour-detail-difficulties">
                            <Typography variant="h5alt">{tour?.difficulty_orig}</Typography>
                            <span className="tour-detail-tag tour-detail-tag-gray">{tour?.difficulty}</span>
                        </div>
                        <Typography variant="textSmall">{tour?.description}</Typography>
                    </Box>
                    <div className="tour-detail-provider-container">
                        <div className="tour-detail-provider-icon">
                            <ProviderLogo provider={tour?.provider} style={{strokeWidth: 0}}/>
                        </div>
                        <div className="tour-detail-provider-name-link">
                            <span className="tour-detail-provider-name">{tour?.provider_name}</span>
                            <span className="tour-detail-provider-link">{tour?.url}</span>
                        </div>
                    </div>
                    <Divider variant="middle"/>
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
            {/*<Box>*/}
            {/*    /!*Calender*!/*/}
            {/*    <pre>All connections: {JSON.stringify(connections?.length)}</pre>*/}
            {/*    <pre>Active connection: {JSON.stringify(activeConnection?.id)}</pre>*/}
            {/*    <pre>Active return connection: {JSON.stringify(activeReturnConnection?.id)}</pre>*/}
            {/*</Box>*/}
            <Box>
                <Button variant="outlined" fullWidth disabled={downloadButtonsDisabled()} onClick={() => {
                    onDownloadGpx();
                }}>
                    <div><DownloadIcon/>GPX</div>
                    {!!isGpxLoading ?
                        <CircularProgress sx={{width: "20px", height: "20px"}} size={"small"}/>
                        : 'Track für GPS-Gerät herunterladen'
                    }
                </Button>
                <Button sx={{height: "100%"}} variant="outlined" fullWidth disabled={downloadButtonsDisabled()}
                        onClick={onDownload}>
                    <PdfIcon/>PDF
                    {!!isPdfLoading ?
                        <CircularProgress sx={{width: "20px", height: "20px"}} size={"small"}/>
                        : 'Download für Druck / Mailversand'
                    }
                </Button>
                {!!downloadButtonsDisabled() &&
                    <div style={{marginTop: "10px"}}>
                        <span style={{fontSize: "12px", color: "#101010", lineHeight: "12px"}}>Ein Download ist nur möglich wenn eine Verbindung gefunden wurde. Versuchen Sie bitte einen anderen Tag zu wählen.</span>
                    </div>
                }
            </Box>
        </Box>
        <Footer></Footer>
    </Box>;
}

const mapDispatchToProps = {
    loadTour,
    loadTours,
    loadTourConnectionsExtended,
    loadGPX,
    loadTourGpx,
    loadTourPdf
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

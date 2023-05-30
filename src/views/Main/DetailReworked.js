import * as React from 'react';
import {useEffect, useState} from 'react';
import Footer from "../../components/Footer/Footer";
import SearchContainer from "../Start/SearchContainer";
import InteractiveMap from "../../components/InteractiveMap";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useSearchParams} from "react-router-dom";
import {loadTour, loadTourConnectionsExtended, loadTourGpx, loadTourPdf, loadTours} from "../../actions/tourActions";
import {compose} from "redux";
import {connect} from "react-redux";
import {loadGPX} from "../../actions/fileActions";
import GpxParser from "gpxparser";
import {Divider} from "@mui/material";
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
import {loadAllCities, loadCities} from "../../actions/cityActions";
import {useTranslation} from 'react-i18next';
import Itinerary from "../../components/Itinerary/Itinerary";
import {useNavigate} from "react-router";

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

const DetailReworked = (props) => {

    console.log(props);
    const {
        loadTour,
        loadTours,
        loadTourConnectionsExtended,
        loadGPX,
        loadTourGpx,
        isGpxLoading,
        loadTourPdf,
        isPdfLoading,
        allCities,
        tour,
        loadCities,
        loadAllCities
    } = props;

    const [connections, setConnections] = useState(null);
    const [activeConnection, setActiveConnection] = useState(null);
    const [activeReturnConnection, setActiveReturnConnection] = useState(null);
    const [dateIndex, setDateIndex] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [gpxPositions, setGpxPositions] = useState(null);
    const [anreiseGpxPositions, setAnreiseGpxPositions] = useState(null);
    const [abreiseGpxPositions, setAbreiseGpxPositions] = useState(null);
    const [renderImage, setRenderImage] = useState(null);

    // Translation-related
    const {t} = useTranslation();
    const translateDiff = (diff) => {
        if (diff === "Leicht") {
            return t('start.leicht');
        } else if (diff === "Schwer") {
            return t('start.schwer');
        } else return t('start.mittel');
    };

    const navigate = useNavigate();
    const goToStartPage = () => {
        console.log('going home')
        let city = searchParams.get('city');
        navigate(`/?${!!city ? 'city=' + city : ''}`)
    }

    useEffect(() => {
        loadAllCities();
        loadCities({limit: 5});
        const tourId = searchParams.get("id");
        const city = searchParams.get("city");

        if (tourId) {
            loadTour(tourId, city);
        }
        if (tourId && city && !connections) {
            loadTourConnectionsExtended({id: tourId, city: city}).then(res => {
                if (res && res.data) {
                    setConnections(res.data.result);
                }
            })
        }
    }, []);

    useEffect(() => {
        if (tour) {
            if (!tour.cities_object[searchParams.get("city")]) {
                goToStartPage();
            } else {
                setGpxTrack(tour.gpx_file, loadGPX, setGpxPositions);
                setGpxTrack(tour.totour_gpx_file, loadGPX, setAnreiseGpxPositions);
                setGpxTrack(tour.fromtour_gpx_file, loadGPX, setAbreiseGpxPositions);
                setRenderImage(!!tour?.image_url);
            }
        }
    }, [!!tour]);

    useEffect(() => {
        let index = dateIndex;
        if (connections) {
            let date = moment(searchParams.get("datum"));
            if (date.isValid()) {
                if (moment(date).isBetween(moment(connections[0].date), moment(connections[6].date), 'days', '[]')) {
                    index = connections.findIndex(connection => moment(connection.date).format('DD.MM.YYYY') === date.format('DD.MM.YYYY'));
                    setDateIndex(index);
                } else {
                    goToStartPage();
                }
            }
            setActiveConnection(connections[index]);
            setActiveReturnConnection(connections[index].returns[0]);
        }
    }, [!!connections]);

    async function onDownload() {
        const connectionDate = activeConnection?.date;
        try {
            const response = await loadTourPdf({
                id: tour?.id,
                connection_id: !!activeConnection?.connections[0] ? activeConnection?.connections[0].id : undefined,
                connection_return_id: !!activeReturnConnection ? activeReturnConnection.id : undefined,
                connection_return_ids: (!!activeConnection.returns ? activeConnection.returns.map(e => e.id) : []),
                connectionDate
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
        if (!!activeReturnConnection && activeReturnConnection.fromtour_track_key && !!activeConnection && !!activeConnection?.connections[0]?.totour_track_key) {
            loadTourGpx({
                id: tour.id,
                key_anreise: activeConnection.connections[0].totour_track_key,
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
        return !!!tour || !!!tour.gpx_file || !!!activeConnection || !!!activeConnection?.connections[0]?.totour_track_key || !!!activeReturnConnection || !!!activeReturnConnection.fromtour_track_key;
    }

    const updateActiveConnectionIndex = (index) => {
        setDateIndex(index);
        setActiveConnection(connections[index]);
        setActiveReturnConnection(connections[index].returns[0]);
    };

    const actionButtonPart = <Box className="tour-detail-action-btns-container">
        <Button className="tour-detail-action-btns" disabled={downloadButtonsDisabled()} onClick={() => {
            onDownloadGpx();
        }}>
            <DownloadIcon/><span style={{color: "#101010", width: "43px"}}>GPX</span>
            {!!isGpxLoading ?
                <CircularProgress sx={{width: "20px", height: "20px", fontWeight: 600}} size={"small"}/>
                : <span style={{color: "#8B8B8B"}}>Track für GPS-Gerät herunterladen</span>
            }
        </Button>
        <Button className="tour-detail-action-btns" disabled={downloadButtonsDisabled()}
                onClick={onDownload}>
            <PdfIcon/><span style={{color: "#101010", width: "43px", fontWeight: 600}}>PDF</span>
            {!!isPdfLoading ?
                <CircularProgress sx={{width: "20px", height: "20px"}} size={"small"}/>
                : <span style={{color: "#8B8B8B"}}>Download für Druck / Mailversand</span>
            }
        </Button>

        {!!downloadButtonsDisabled() &&
            <div style={{marginTop: "10px"}}>
                <span style={{fontSize: "12px", color: "#101010", lineHeight: "12px"}}>Ein Download ist nur möglich wenn eine Verbindung gefunden wurde. Versuchen Sie bitte einen anderen Tag zu wählen.</span>
            </div>
        }
    </Box>;

    return <Box sx={{"backgroundColor": "#FFFFFF"}}>
        <Box sx={{background: "#4992FF"}}>
            {(!!allCities && allCities.length > 0) &&
                <SearchContainer goto={"/suche"}/>
            }
        </Box>
        <Box>
            <Box className="tour-detail-header">
                <Box className="mt-3">
                    <Typography variant="title">{tour?.title}</Typography>
                </Box>
                <Box className="mt-3">
                    <span className="tour-detail-tag">{tour?.range}</span>
                </Box>
            </Box>
            <div>
                <Box sx={{width: "100%", position: "relative"}} className="tour-detail-map-container">
                    <InteractiveMap gpxPositions={gpxPositions} anreiseGpxPositions={anreiseGpxPositions}
                                    abreiseGpxPositions={abreiseGpxPositions} scrollWheelZoom={false}/>
                </Box>
                <div className="tour-detail-data-container">
                    <Box>
                        <TourDetailProperties tour={tour}></TourDetailProperties>
                        <Box sx={{"textAlign": "left"}}>
                            <div className="tour-detail-difficulties">
                                {/* <span className="tour-detail-difficulty">{tour?.difficulty_orig}</span> */}
                                {/* <span className="tour-detail-tag tour-detail-tag-gray">{tour?.difficulty}</span> */}
                                <span
                                    className="tour-detail-difficulty">{tour && translateDiff(tour.difficulty_orig)}</span>
                                <span
                                    className="tour-detail-tag tour-detail-tag-gray">{tour && translateDiff(tour.difficulty)}</span>
                            </div>
                            <Typography variant="textSmall">{tour?.description}</Typography>
                        </Box>
                        <div className="tour-detail-provider-container" onClick={() => {
                            window.open(tour?.url)
                        }}>
                            <div className="tour-detail-provider-icon">
                                <ProviderLogo provider={tour?.provider}/>
                            </div>
                            <div className="tour-detail-provider-name-link">
                                <span className="tour-detail-provider-name">{tour?.provider_name}</span>
                                <span className="tour-detail-provider-link">{tour?.url}</span>
                            </div>
                        </div>
                        { renderImage &&
                            <Box className="tour-detail-conditional-desktop">
                                <Divider variant="middle"/>
                                <div className="tour-detail-img-container">
                                    <img
                                        src={tour.image_url}
                                        alt="image"
                                        onError={() => {
                                            setRenderImage(false);
                                        }}
                                    />
                                </div>
                            </Box>
                        }
                        <Box className="tour-detail-conditional-desktop">
                            {actionButtonPart}
                        </Box>
                    </Box>
                    <Box className="tour-detail-itinerary-container">
                        <Itinerary connectionData={connections} dateIndex={dateIndex}
                                   onDateIndexUpdate={(di) => updateActiveConnectionIndex(di)}></Itinerary>
                    </Box>
                    { renderImage &&
                        <Box className="tour-detail-conditional-mobile">
                            <Divider variant="middle"/>
                            <div className="tour-detail-img-container">
                                <img
                                    src={tour.image_url}
                                    alt="image"
                                    onError={() => {
                                        setRenderImage(false);
                                    }}
                                />
                            </div>
                        </Box>
                    }
                    {
                        <Box className="tour-detail-conditional-mobile">
                            {actionButtonPart}
                        </Box>
                    }
                </div>
            </div>
            <div>
            </div>
            <Divider variant="middle"/>

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
    loadTourPdf,
    loadCities,
    loadAllCities
};

function mapStateToProps(state) {
    return {
        isPdfLoading: state.tours.isPdfLoading,
        isGpxLoading: state.tours.isGpxLoading,
        cities: state.cities.cities,
        allCities: state.cities.all_cities,
        tour: state.tours.tour
    }
}

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
)(DetailReworked)

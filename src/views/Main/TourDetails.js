import * as React from 'react';
import Box from '@mui/material/Box';
import CustomStarRating from "../../components/CustomStarRating";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
// import DifficultyContainer from "../../components/DifficultyContainer";
import TourProperty from "../../components/TourProperty";
import {convertNumToTime, formatNumber, parseFileName, titleCase} from "../../utils/globals";
import Expand from "../../icons/Expand";
import InteractiveMap from "../../components/InteractiveMap";
import {useEffect, useState} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {loadGPX} from "../../actions/fileActions";
import {loadTourGpx, loadTourPdf} from "../../actions/tourActions";
let gpxParser = require('gpxparser');
import FileDownload from "react-file-download";
import {Buffer} from 'buffer';
import CircularProgress from "@mui/material/CircularProgress";
import {useSearchParams} from "react-router-dom";

const setGpxTrack = (url, loadGPX, _function) => {
    loadGPX(url).then(res => {
        if(!!res && !!res.data){
            let gpx = new gpxParser(); //Create gpxParser Object
            gpx.parse(res.data);
            if(gpx.tracks.length > 0){
                const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon]);
                _function(positions);
            }
        }
    })
}

function TourDetails({tour, loadGPX, loadTourPdf, isPdfLoading, connection, returnConnection, loadTourGpx, isGpxLoading, handleTabChange, returnConnections}){

    const [gpxPositions, setGpxPositions] = useState(null);
    const [anreiseGpxPositions, setAnreiseGpxPositions] = useState(null);
    const [abreiseGpxPositions, setAbreiseGpxPositions] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const returnsLength = !!returnConnection ? returnConnection.connection_returns_trips_back : 0;

    useEffect(() => {
        setGpxTrack(tour.gpx_file, loadGPX, setGpxPositions);
        setGpxTrack(tour.totour_gpx_file, loadGPX, setAnreiseGpxPositions);
        setGpxTrack(tour.fromtour_gpx_file, loadGPX, setAbreiseGpxPositions);

    }, [tour]);

    useEffect(() => {
        if(!!connection && !!connection.gpx_file){
            setGpxTrack(connection.gpx_file, loadGPX, setAnreiseGpxPositions);
        }
        if(!!returnConnection && !!returnConnection.gpx_file){
            setGpxTrack(returnConnection.gpx_file, loadGPX, setAbreiseGpxPositions);
        }

    }, [connection || returnConnection]);

    const onDownload = () => {
        const datum = searchParams.get("datum");
        loadTourPdf({ id: tour.id, connection_id: !!connection ? connection.id : undefined, connection_return_id: !!returnConnection ? returnConnection.id : undefined, connection_return_ids: (!!returnConnections ? returnConnections.map(e => e.id) : []), datum}).then(
            (res) => {
                if(!!res && !!res.data && !!res.data.pdf){
                    const buf = Buffer.from(res.data.pdf, 'base64');
                    FileDownload(buf, res.data.fileName, "application/pdf");
                }
            },
            (err) => {
                console.log('error: ', err)
            }
        );
    }

    const onDownloadGpx = () => {

        if(!!returnConnection && returnConnection.fromtour_track_key && !!connection && !!connection.totour_track_key){
            loadTourGpx({id: tour.id, key_anreise: connection.totour_track_key, key_abreise: returnConnection.fromtour_track_key, type: "all"}).then( (res) => {
                    if(!!res && !!res.data){
                        FileDownload(res.data, parseFileName(tour.title, "zuugle_", ".gpx"));
                    }
                },
                (err) => {
                    console.log('error: ', err)
                });
        } else {
            loadTourGpx({id: tour.id}).then( (res) => {
                    if(!!res && !!res.data){
                        FileDownload(res.data, parseFileName(tour.title, "zuugle_", ".gpx"));
                    }
                },
                (err) => {
                    console.log('error: ', err)
                });
        }
    }

    const buttonsDisabled = () => {
        return !!!tour || !!!tour.gpx_file || !!!connection || !!!connection.totour_track_key || !!!returnConnection || !!!returnConnection.fromtour_track_key;
    }

    const openProviderLink = (provider, url) => {
        if(provider === "bahnzumberg"){
            let city = searchParams.get('city');
            let appendix = "";
            if(!!city){
                appendix = `ab-${city}/`;
            }
            window.open(url + appendix);
        } else {
            window.open(url);
        }
    }

    const get_provider_url = (url) => {
        const length = 200;
        let red_url = url.replace("https://www.", "").replace("http://www.", "").split("/"), i;
        let final_url = red_url[0];
        
        for (i = 1; i < red_url.length-1; i++) {
            if (final_url.length + red_url[i].length <= length) {
                if (i == red_url.length-2) {
                    if (red_url[i].length > 27) {
                        final_url = final_url + " > " + "..." + red_url[i].substring(red_url[i].length-30, red_url[i].lenght);
                    }
                    else {
                        final_url = final_url + " > " + red_url[i];
                    }
                }
                else {
                    final_url = final_url + " > " + red_url[i]
                }
            }
            else {
                return final_url;
            }
        }

        return final_url;
    }

    return <Box sx={{ width: '100%', padding: 0}}>

        <Box sx={{width: "100%", position: "relative", height: 300}}>
            <InteractiveMap gpxPositions={gpxPositions} anreiseGpxPositions={anreiseGpxPositions} abreiseGpxPositions={abreiseGpxPositions}/>
            <Box sx={{position: "absolute", right: "20px", top: "20px", width: "40px", height: "40px", backgroundColor: "#FFFFFF", borderRadius: "12px"}}>
                <Box sx={{padding: "8px"}}>
                    <Expand style={{stroke: "#000000", strokeWidth: 0.3}}/>
                </Box>
            </Box>
        </Box>
        <Box sx={{padding: 3}}>
            <CustomStarRating />

            <Box className="mt-3">
                <Typography variant="h5">{tour.range}</Typography>
            </Box>
            <Box className="mt-3">
                <Typography variant="h4">{tour.title}</Typography>
            </Box>

            <Box sx={{marginTop: '20px'}}>
                <Grid container spacing={'10px'}>
                    <Grid item xs={4}>
                        <Button variant="outlined" fullWidth disabled={buttonsDisabled()} onClick={() => {
                            onDownloadGpx();
                        }}>{!!isGpxLoading ? <CircularProgress sx={{width: "20px", height: "20px"}} size={"small"}/> : 'GPX Download'}</Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button sx={{height: "100%"}} variant="outlined" fullWidth disabled={buttonsDisabled()} onClick={onDownload}>
                            {!!isPdfLoading ? <CircularProgress sx={{width: "20px", height: "20px"}} size={"small"}/> : 'PDF'}</Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" fullWidth disabled={!!!tour.url} onClick={() => {
                            openProviderLink(tour.provider, tour.url);
                        }}>{tour.provider_name}</Button>
                    </Grid>
                </Grid>
                {!!buttonsDisabled() &&
                    <div style={{marginTop: "10px"}}>
                        <span style={{fontSize: "12px", color: "#101010", lineHeight: "12px"}}>Ein Download ist nur möglich wenn eine Verbindung gefunden wurde. Versuchen Sie bitte
                            <span style={{lineHeight: "12px", color: "#4992FF"}} className={"cursor-link"} onClick={() => handleTabChange(null,     1)}> hier </span>
                            einen anderen Tag zu wählen.</span>
                    </div>
                }
            </Box>

            <Box sx={{marginTop: '20px'}}>
                <Typography variant={"text"}>
                    {tour.description} 
                </Typography>
            </Box>

            <Box sx={{marginTop: '20px'}}>
                <Typography sx={{textDecoration: "underline"}} className={"cursor-link"} onClick={() => { openProviderLink(tour.provider, tour.url); }} variant="mt-3" style={{whiteSpace: "break-spaces"}}>{ get_provider_url(tour.url) }</Typography>
            </Box>

            <Box sx={{marginTop: '20px'}}>
                <Box sx={{ bgcolor: 'info.main', borderRadius: '16px', padding: '20px', position: 'relative' }}>
                    {!!connection && !!connection.id ? <Typography>Öffentliche Anreise gefunden mit {returnsLength >= 100 ? "99+" : returnsLength} {returnsLength > 1 ? 'Rückfahrten' : 'Rückfahrt'}</Typography>
                        : <Typography>Keine öffentliche Anreise gefunden</Typography>
                    }

                </Box>
            </Box>

            <Box sx={{marginTop: '20px'}}>
                {/* {console.log('tour value L210', tour)} */}
                {/* {console.log((tour.difficulty_orig).toUpperCase())}
                {console.log(titleCase(tour.difficulty_orig))} */}
                {/* <DifficultyContainer value={tour.difficulty} disabled={true}/> */}
                
                <Grid container spacing={'20px'}>
                    <Grid item xs={6}>
                        <TourProperty title={"Schwierigkeit Zuugle"} text={`${titleCase(tour.difficulty)}`}/>
                    </Grid>
                    <Grid item xs={6}>
                        {/* <TourProperty title={"Schwierigkeit original"} text={`${tour.provider} : ${tour.difficulty_orig}`} /> */}
                        <TourProperty title={"Schwierigkeit original"} text={`${titleCase(tour.difficulty_orig)}`} />
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{marginTop: '20px'}}>
                <Grid container spacing={'20px'}>
                    <Grid item xs={6}>
                        <TourProperty title={"Sportart"} text={tour.type}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TourProperty title={"Distanz"} text={formatNumber(tour.distance) + ' km'} />
                    </Grid>
                    <Grid item xs={6}>
                        <TourProperty title={"Dauer"} text={(!!tour.number_of_days && tour.number_of_days > 1) ? (tour.number_of_days + ' Tage') : convertNumToTime(tour.total_tour_duration)} />
                    </Grid>
                    <Grid item xs={6}>
                        <TourProperty title={"Aufstieg"} text={formatNumber(tour.ascent, ' hm')} />
                    </Grid>
                    <Grid item xs={6}>
                        <TourProperty title={"Abstieg"} text={formatNumber(tour.descent, ' hm')} />
                    </Grid>
                    <Grid item xs={6}>
                        <TourProperty title={"Kinderfreundlich"} text={!!tour.children ? 'Ja' : 'Nein'} />
                    </Grid>
                    <Grid item xs={6}>
                        <TourProperty title={"Überschreitung"} text={!!tour.traverse ? 'Ja' : 'Nein'} />
                    </Grid>
                </Grid>
            </Box>

        </Box>
    </Box>
}

const mapDispatchToProps = {
    loadGPX,
    loadTourPdf,
    loadTourGpx
};


const mapStateToProps = (state) => {
    return {
        isPdfLoading: state.tours.isPdfLoading,
        isGpxLoading: state.tours.isGpxLoading
    }
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
)(TourDetails)
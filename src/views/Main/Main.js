import * as React from 'react';
import {lazy, useEffect, useState} from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import {compose } from "redux";
import {connect} from "react-redux";
import {
    clearTours,
    loadFilter, loadTour,
    loadTourConnections,
    loadTourConnectionsExtended,
    loadTours,
} from "../../actions/tourActions";
import {hideModal, showModal} from "../../actions/modalActions";
import {loadAllCities} from "../../actions/cityActions";
import {useNavigate, useSearchParams} from "react-router-dom";
import {getFilterFromParams, getFilterProp, myTrackPageView} from "../../utils/globals";
import {useLocation} from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress";
import {useMatomo} from "@datapunt/matomo-tracker-react";
// import {useBackListener} from "../../utils/backListener";
import TourMapContainer from "../../components/Map/TourMapContainer";
import * as PropTypes from "prop-types";
import {loadGPX} from "../../actions/fileActions";
import {Typography} from "@mui/material";
import {checkIfSeoPage, checkIfSeoPageCity, checkIfSeoPageRange, getPageHeader} from "../../utils/seoPageHelper";
import {loadRanges} from "../../actions/rangeActions";
import {Helmet} from "react-helmet";

const Search = lazy(() => import('../../components/Search/Search'));
const Detail = lazy(() => import('./Detail'));
const ResultBar = lazy(() => import('../../components/ResultBar'));
const TourCardContainer = lazy(() => import('../../components/TourCardContainer'));

function Fragment(props) {
    return null;
}

Fragment.propTypes = {children: PropTypes.node};

export function Main({loadTours, loadAllCities, tours, showModal, hideModal, totalTours, loadTourConnections, filter, loadTourConnectionsExtended, pageTours, loading, allCities, loadFilter, isLoadingFilter, loadGPX, loadTour, clearTours, allRanges, loadRanges}){
    const navigate = useNavigate();
    const location = useLocation();

    const { trackPageView, trackEvent } = useMatomo()

    const [detailOpen, setDetailOpen] = useState(false);
    const [tour, setTour] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [filterActive, setFilterActive] = React.useState(0);
    const [mapView, setMapView] = React.useState(false);
    const [directLink, setDirectLink] = React.useState(null);

    // useBackListener(({ location }) => {
    //     navigate('/');
    // });

    useEffect(() => {
        const city = searchParams.get('city');
        myTrackPageView("Main", trackPageView, city);
    }, [])

    useEffect(() => {
        loadAllCities();
        loadRanges({ignore_limit: true, remove_duplicates: true});
        let searchParamCity = searchParams.get('city');
        const city = localStorage.getItem('city');
        if(!!city && !!!searchParamCity){
            searchParams.set('city', city);
            setSearchParams(searchParams);
        }
    }, []);

    useEffect(() => {
        if(!!location && location.pathname && allCities && allCities.length > 0  && allRanges && allRanges.length > 0){
            const city = checkIfSeoPageCity(location, allCities);
            const range = checkIfSeoPageRange(location, allRanges);
            if(!!city && city.value){
                searchParams.set('city', city.value);
                setSearchParams(searchParams);
                setDirectLink({
                    header: `Öffi-Bergtouren für ${city.label}`,
                    description: `Alle Bergtouren, die du von ${city.label} aus, mit Bahn und Bus, erreichen kannst.`
                });
            } else if(!!range && !!range.range){
                searchParams.set('range', range.range);
                setSearchParams(searchParams);
                setDirectLink({
                    header: `Gebirgsgruppe ${range.range}`,
                    description: `Alle Bergtouren in der Gebirgsgruppe "${range.range}".`
                });
            } else if(location && location.pathname !== "/suche"){
                navigate('/');
            }
        }

    }, [allCities && allRanges]);

    useEffect(() => {
        if(!!location && !!location.state &&!!location.state.tour){
            setTour(location.state.tour);
            setDetailOpen(true);
        }
    }, [location])

    // console.log("Line 106 tour :", tour);

    useEffect(() => {
        setFilterActive(countFilterActive());
        setMapView(searchParams.get("map") == "true");
    }, [searchParams || filter])

    const countFilterActive = () => {
        const _filter = getFilterFromParams(searchParams);
        let count = 0;
        if(!!_filter && !!filter){
            if(!(!!_filter.singleDayTour && !!_filter.multipleDayTour)){
                count++;
            }
            if(!(!!_filter.summerSeason && !!_filter.winterSeason)){
                count++;
            }
            if(_filter.difficulty != 10){
                count++;
            }
            if(!!_filter.children){
                count++;
            }
            if(!!_filter.traverse){
                count++;
            }
            if(_filter.maxAscent != getFilterProp(filter, "maxAscent") || _filter.minAscent != getFilterProp(filter, "minAscent")){
                count++;
            }
            if(_filter.maxDescent != getFilterProp(filter, "maxDescent") || _filter.minDescent != getFilterProp(filter, "minDescent")){
                count++;
            }
            if(_filter.maxTransportDuration != getFilterProp(filter, "maxTransportDuration") || _filter.minTransportDuration != getFilterProp(filter, "minTransportDuration")){
                count++;
            }
            if(_filter.minDistance != getFilterProp(filter, "minDistance") || _filter.maxDistance != getFilterProp(filter, "maxDistance")){
                count++;
            }
            if(_filter.ranges.length != filter.ranges.length){
                count++;
            }
            if(_filter.types.length != filter.types.length){
                count++;
            }
        }

        return count;
    }


    const toggleDetailOpen = () => {
        setDetailOpen(!detailOpen);
    }

    const onSelectTour = (tour) => {
        // console.log("Main L 161, onSelectTour , tour value: " + tour);
        setTour(tour)
        toggleDetailOpen();
    }

    const onLoadAndSelectTour = (id) => {
        loadTour(id, searchParams.get('city')).then(res => {
            if(!!res && !!res.data && !!res.data.tour){
                // console.log("Main : tour data L168",res.data.tour)
                setTour(res.data.tour);
                toggleDetailOpen();
            }
        })
    }

    return <div>
        {getPageHeader(directLink)}
        <Box sx={{width: "100%"}} className={"search-result-header-container"}>
            {
                !!directLink && <Box className={"seo-bar"}>
                    <Typography variant={"h1"} sx={{color: "#000000", fontSize: "18px", marginBottom: "5px"}}>{directLink.header}</Typography>
                    <Typography variant={"text"} sx={{fontSize: "14px"}}>{directLink.description}</Typography>
                </Box>
            }
            {(!!allCities && allCities.length > 0) &&
                <Box sx={{backgroundColor: "#FFF"}}>
                    <Box className={"main-search-bar"}>
                        <Search isMain={true}/>
                    </Box>
                </Box>
            }
            <ResultBar showModal={showModal} hideModal={hideModal} total={totalTours} filter={filter} filterActive={filterActive} everythingDisabled={totalTours==0} clearTours={clearTours}/>
        </Box>

        {(!!loading && !!!mapView) &&
            <Box sx={{textAlign: "center", padding: "30px"}}>
                <CircularProgress />
            </Box>
        }

        {
            (!!tours && tours.length > 0) && <>
            {
                !!mapView ? (
                    <Box className={"map-container"}>
                        <TourMapContainer tours={tours} loadGPX={loadGPX} onSelectTour={onLoadAndSelectTour} loading={loading}/>
                    </Box>)
                    : <Box className={"cards-container" + ((!!directLink && !!directLink.header) ? " seo-page" : "")}>
                        <TourCardContainer onSelectTour={onSelectTour}
                                           tours={tours}
                                           loadTourConnections={loadTourConnections} city={searchParams.get("city")}
                                           loadTours={loadTours} totalTours={totalTours} pageTours={pageTours}
                                           loading={loading} total={totalTours}/>
                    </Box>
            }
            </>

        }

        <Drawer
            anchor={"right"}
            open={detailOpen}
            onClose={toggleDetailOpen}
            PaperProps={{
                sx: {
                    backgroundColor: "info.main",
                    width: {
                        xs: "100%",
                        sm: "500px"
                    }
                }
            }}
        >
            <Detail tour={tour} loadTourConnectionsExtended={loadTourConnectionsExtended} onClose={() => setDetailOpen(false)}/>
        </Drawer>
    </div>
}



const mapDispatchToProps = {
    loadTours,
    loadAllCities,
    showModal,
    hideModal,
    loadTourConnections,
    loadTourConnectionsExtended,
    loadFilter,
    loadGPX,
    loadTour,
    clearTours,
    loadRanges
};


const mapStateToProps = (state) => {
    // console.log("Main L256 list of ALL tours : state.tours.tours :", state.tours.tours)
    return {
        loading: state.tours.loading,
        tours: state.tours.tours,
        allCities: state.cities.all_cities,
        allRanges: state.ranges.ranges,
        filter: state.tours.filter,
        totalTours: state.tours.total,
        pageTours: state.tours.page,
    }
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
)(Main)
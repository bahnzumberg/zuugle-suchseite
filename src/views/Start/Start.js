import * as React from 'react';
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import {lazy, useEffect} from "react";
import {
    loadFavouriteTours, loadTotalTours,
    loadTourConnections,
    loadTourConnectionsExtended,
} from "../../actions/tourActions";
import {loadAllCities, loadCities} from "../../actions/cityActions";
import {compose} from "redux";
import {connect} from "react-redux";
import Footer from "../../components/Footer/Footer";
import {loadRanges} from "../../actions/rangeActions";
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router";
import { useMatomo } from '@datapunt/matomo-tracker-react'
import {myTrackPageView} from "../../utils/globals";
import FooterLinks from "../../components/Footer/FooterLinks";
import {getPageHeader, listAllCityLinks, listAllRangeLinks} from "../../utils/seoPageHelper";

const RangeCardContainer = lazy(() => import('../../components/RangeCardContainer'));
const ScrollingTourCardContainer = lazy(() => import('../../components/ScrollingTourCardContainer'));
const KPIContainer = lazy(() => import('../../components/KPIContainer'));
const AboutZuugleContainer = lazy(() => import('../../components/AboutZuugleContainer'));
const UserRecommendationContainer = lazy(() => import('../../components/UserRecommendationContainer'));
const Header = lazy(() => import('./Header'));
const SponsoringContainer = lazy(() => import('../../components/SponsoringContainer'));

// import * as headerdata from "../../../public/header/header.json";
// import * as headerdata from "../../public/header/header.json";
/*
try {
    const headerdata = JSON.parse("../../../public/header/header.json");
}
catch(e){
    console.error(e);
}
console.log(headerdata.at);
*/
function Start({loadFavouriteTours, favouriteTours, loadCities, loadTourConnections, totalTours, loadTotalTours, totalConnections, totalCities, totalRanges, favouriteRanges, loadAllCities, allCities, totalProvider, loadRanges, allRanges}){
    const { trackPageView } = useMatomo()
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    useEffect(() => {
        const city = searchParams.get('city');
        myTrackPageView("Start", trackPageView, city);
    }, []);

    /*new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
            console.log('LCP candidate:', entry.startTime, entry);
        }
    }).observe({type: 'largest-contentful-paint', buffered: true});*/

    useEffect(() => {
        loadAllCities();
        loadTotalTours();
        loadRanges({ignore_limit: true, remove_duplicates: true});

        let searchParamCity = searchParams.get('city');
        const city = localStorage.getItem('city');
        if(!!city && !!!searchParamCity){
            searchParams.set('city', city);
            setSearchParams(searchParams);
        }

        loadCities({limit: 5});
        loadFavouriteTours({sort: "relevanz", limit: 10, city: !!city ? city : undefined, ranges: true, provider: searchParams.get('p')});

    }, [])

  
    const onSelectTour = (tour) => {
        let _city = searchParams.get('city');
        navigate(`/suche?sort=relevanz&search=${tour.title.replace(/[()-]/g, ' ')}${!!_city ? '&city='+_city : ''}`, {
            state: {
                tour: tour,
            }
        })
    }

    const onSelectRange = (range) => {
        let _city = searchParams.get('city');
        if(!!range && !!range.range){
            navigate(`/suche?sort=relevanz&range=${range.range}${!!_city ? '&city='+_city : ''}`)
        }
    }

    const getRangeText = () => {
        let _city = searchParams.get('city');
        if(!!_city && _city.length > 0){
            return "Die schönsten Wanderdestinationen in deiner Nähe";
        } else {
            return "Die schönsten Wanderdestinationen";
        }
    }

    const getFavouriteToursText = () => {
        let _city = searchParams.get('city');
        if(!!_city && _city.length > 0){
            return "Beliebte Bergtouren in deiner Nähe";
        } else {
            return "Beliebte Bergtouren";
        }
    }

    if (totalTours==0) {
        return <Box>
            <Header totalTours={totalTours} allCities={allCities}/>
            <Footer />
        </Box>
    }
    else {
        return <Box>
            {getPageHeader(null)}
            <Header totalTours={totalTours} allCities={allCities}/>
            <Box elevation={0} className={"header-line"}>
                <Box sx={{padding: "20px"}}>
                    <Typography color={"#FFFFFF"} sx={{textAlign: "left"}}>Zuugle sucht für dich in {totalProvider} Tourenportalen nach Öffi-Bergtouren</Typography>
                </Box>
            </Box>
            <Box className={'start-body-container'}>
                <Box>
                    <Typography variant={"h4"} sx={{textAlign: "left", paddingBottom: "15px"}}>{getRangeText()}</Typography>
                    <RangeCardContainer ranges={favouriteRanges} onSelectTour={onSelectRange}/>
                </Box>

                <Box sx={{marginTop: '20px'}}>
                    <Typography variant={"h4"} sx={{textAlign: "left", paddingTop: '20px', paddingBottom: "15px"}}>{getFavouriteToursText()}</Typography>
                    <ScrollingTourCardContainer tours={favouriteTours} onSelectTour={onSelectTour} loadTourConnections={loadTourConnections} city={searchParams.get('city')}/>
                </Box>

                <Box sx={{marginTop: '20px'}}>
                    <AboutZuugleContainer />
                </Box>

                <Box sx={{marginTop: '20px'}}>
                    <UserRecommendationContainer />
                </Box>

                <Box sx={{marginTop: '20px'}}>
                    <SponsoringContainer />
                </Box>

                <Box sx={{marginTop: '20px'}}>
                    <KPIContainer totalTours={totalTours} totalConnections={totalConnections} totalRanges={totalRanges} totalCities={totalCities} city={searchParams.get('city')} totalProvider={totalProvider}/>
                </Box>
            </Box>
            <FooterLinks links={listAllCityLinks(allCities, searchParams)}/>
            <FooterLinks links={listAllRangeLinks(allRanges, searchParams)}/>
            <Footer/>
        </Box>
    }
}



const mapDispatchToProps = {
    loadFavouriteTours,
    loadCities,
    loadRanges,
    loadTourConnectionsExtended,
    loadTourConnections,
    loadTotalTours,
    loadAllCities
};


const mapStateToProps = (state) => {
    return {
        loading: state.tours.loading,
        favouriteTours: state.tours.favouriteTours,
        favouriteRanges: state.tours.favouriteRanges,
        allRanges: state.ranges.ranges,
        totalTours: state.tours.total_tours,
        totalConnections: state.tours.total_connections,
        totalRanges: state.tours.total_ranges,
        totalCities: state.tours.total_cities,
        allCities: state.cities.all_cities,
        totalProvider: state.tours.total_provider,
    }
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
)(Start)
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
import {loadRanges} from "../../actions/rangeActions";
import {compose} from "redux";
import {connect} from "react-redux";
import Footer from "../../components/Footer/Footer";
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

// General Description of Start.js:
// Code's main function is displaying information about tours. 
// libraries used  :
//      redux / react-redux : compose / connect
//      react : useEffect, lazy
//      React-router-dom / react-router: using  useSearchParams / useNavigate
//      Material UI components
//      matomo-tracker-react
// Components used :
//      from redux 'actions' folder , 3 action creators:  toursActions, cityActions and rangeActions
//      seoPageHelper file with imported functions, one of these uses Helmet library to set up meta tags, other function for rendering seo friendly lists 
// The component uses the React Hook useEffect to perform several side effects when the component is first mounted. This includes loading information about cities, tours, ranges, etc. using the redux action creators.
// Start also uses the React Router Hook useSearchParams to obtain the search parameters from the URL. If the search parameter city is not specified, the component attempts to retrieve the city from local storage.
// Start has two functions onSelectTour and onSelectRange which navigate to the search page with specified parameters (tour name or range) when a tour or a range is selected.
// The component also makes use of the Matomo Tracker React Hook useMatomo to track page views. The function myTrackPageView is used to track the current page view.
// Finally, the component makes use of several lazy-loaded components including RangeCardContainer, ScrollingTourCardContainer, KPIContainer, AboutZuugleContainer, UserRecommendationContainer, Header, and SponsoringContainer.
function Start({loadFavouriteTours, favouriteTours, loadCities, loadTourConnections, totalTours, loadTotalTours, totalConnections, totalCities, totalRanges, favouriteRanges, loadAllCities, allCities, totalProvider, loadRanges, allRanges}){
    const { trackPageView } = useMatomo()
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // description
    // makes use of the Matomo Tracker Hook (useMatomo) to track page views. The function myTrackPageView is used to track the current page view.
    useEffect(() => {
        const city = searchParams.get('city');
        // console.log('city is ' + city);
        myTrackPageView("Start", trackPageView, city);
    }, []);

    // description
// This useEffect hook is used to execute some code in response to a change in the component's state or props. It is executed whenever the component is updated or rendered. The hook runs the loadAllCities function which is an action creator from the file cityActions.js.
// The loadAllCities function takes an optional parameter data and returns a function that is used to dispatch actions to the Redux store. The data object is used to pass any additional data that needs to be sent to the server. In this case, the data object has a property all set to true.
// The dispatch function is used to dispatch actions to the store and the getState function is used to get the current state of the store.
// The loadAllCities function calls another action creator loadList and passes it dispatch, getState, LOAD_ALL_CITIES, LOAD_ALL_CITIES_DONE, "tours", data, "cities/" and "cities" as parameters. LOAD_ALL_CITIES and LOAD_ALL_CITIES_DONE are imported constants from the types file and they represent the types of actions that are being dispatched. The other parameters are used to make an API call to retrieve the cities data.
// The code defines several functions that are used to dispatch actions to the Redux store.
// Each function within the corresponding actions creators (like tourActions.js or cityActions.js) makes an API call using the functions imported from the "crudActions" file and then dispatches an action to the store with the type defined in the imported "types" file and the payload data returned from the API call.
// For example, in the loadTours function, an API call is made to retrieve a list of tours by calling the loadList function imported from the "crudActions" file. If the API call is successful, the action with the type LOAD_TOURS_DONE and the payload data is dispatched to the store.
// Similarly, the loadTour function makes an API call to retrieve a single tour by calling the loadOne function imported from the "crudActions" file. If the API call is successful, the action with the type LOAD_TOUR_DONE and the payload data is dispatched to the store.
// So the code within this useEffect handles the data flow in the application and keep the Redux store updated with the latest data retrieved from the API.
    useEffect(() => {
        loadAllCities();
        loadTotalTours();
        loadRanges({ignore_limit: true, remove_duplicates: true});
        // searchParams.forEach(item=> console.log(item)) // testing params

        let searchParamCity = searchParams.get('city');
        const city = localStorage.getItem('city');
        // console.log('city in LocalStorage :', city);
        // console.log(' searchParamCity:', searchParamCity);
        if(!!city && !!!searchParamCity){
            searchParams.set('city', city);

            setSearchParams(searchParams);
        }

        loadCities({limit: 5});
        loadFavouriteTours({sort: "relevanz", limit: 10, city: !!city ? city : undefined, ranges: true, provider: searchParams.get('p')});

    }, [])

    //description:
// onSelectTour is a function that is called when a tour is selected. This function takes in a single argument tour, which represents the tour that was selected. The purpose of the function is to navigate the user to the search page with the selected tour as the search query.
// Here's what the function does step by step:
// The _city variable is created and set to the value of the city in the searchParams object.
// A navUrl variable is created, which represents the URL that the user will be navigated to. The value of this URL is constructed using string manipulation and includes the tour title, the sort order and the city. The tour title is first cleaned up by replacing characters like (, ), - with spaces.
// The navigate function is called with the navUrl as the argument. The navigate function part of react-route library, with a purpose to navigate the user to a new page.
// An additional state object is passed as an option to the navigate function. This state object contains a single key-value pair, where the key is tour and the value is the selected tour.
// The purpose of onSelectTour  within the Start.js file is to allow users to navigate to the search page with the selected tour as the search query. The state object is passed along so that the search page has access to the tour information.
    const onSelectTour = (tour) => {
        console.log('tour is :L99', tour)
        let _city = searchParams.get('city');
        const navUrl = `/suche?sort=relevanz&search=${tour.title.replace(/[()-]/g, ' ')}${!!_city ? '&city='+_city : ''}`;
        //clgs
        // console.log('Line 73: URL is :', navUrl);
        // console.log(tour)
        // example : navigate(`/suche?sort=relevanz&search=Winterwanderung+über+die+Sonnsteine&city=bad-ischl&datum=2023-02-02`,{
        navigate(navUrl, {
            state: {
                tour: tour,
            }
        })
    }
    //description:
// The onSelectRange is a constant declaration for a JavaScript arrow function in the Start.js file.
// The function takes one parameter range, which represents a selected range object. The function then extracts the city value from the searchParams object, which is an instance of the URLSearchParams API.
// If range is truthy (not null, undefined, or false) and range.range is truthy as well, the function uses the navigate function to navigate to a URL with the following pattern: /suche?sort=relevanz&range=${range.range}${!!_city ? '&city='+_city : ''}.
// The _city value is added to the URL only if it is truthy. The range.range value is included in the URL as the value of the range query parameter. The sort query parameter is set to relevanz.
    const onSelectRange = (range) => {
        let _city = searchParams.get('city');
        if(!!range && !!range.range){
            navigate(`/suche?sort=relevanz&range=${range.range}${!!_city ? '&city='+_city : ''}`)
        }
    }
    //description
// The getRangeText is a function that returns a string depending on the value of _city which is extracted from the searchParams object.
// The function first checks if _city is truthy (not null, undefined, or an empty string) and has a length greater than 0. If this condition is met, the function returns the string "Die schönsten Wanderdestinationen in deiner Nähe".
// Otherwise, if the condition is not met, the function returns the string "Die schönsten Wanderdestinationen".
    const getRangeText = () => {
        let _city = searchParams.get('city');
        if(!!_city && _city.length > 0){
            return "Die schönsten Wanderdestinationen in deiner Nähe";
        } else {
            return "Die schönsten Wanderdestinationen";
        }
    }

    // description
    // The getFavouriteToursText is a constant function that returns a string. The function checks the value of the _city variable which is obtained from the searchParams.get('city') method. If the value of _city exists and its length is greater than 0, it returns the string "Beliebte Bergtouren in deiner Nähe" (which means "Popular mountain tours in your area"). Otherwise, it returns the string "Beliebte Bergtouren" (which means "Popular mountain tours").
    const getFavouriteToursText = () => {
        let _city = searchParams.get('city');
        if(!!_city && _city.length > 0){
            return "Beliebte Bergtouren in deiner Nähe";
        } else {
            return "Beliebte Bergtouren";
        }
    }

    // description
    // This code defines a React component that returns a conditional rendering based on the value of totalTours. If totalTours is equal to 0, the component returns a Box component with a Header and a Footer component.
    // Otherwise, it returns a Box component with several other components:
    // getPageHeader(null)
    // Header with totalTours and allCities props
    // A Box with a white text that says "Zuugle sucht für dich in {totalProvider} Tourenportalen nach Öffi-Bergtouren".
    // A RangeCardContainer component with favouriteRanges and onSelectTour props.
    // A ScrollingTourCardContainer component with favouriteTours, onSelectTour, loadTourConnections, and city props.
    // An AboutZuugleContainer component.
    // A UserRecommendationContainer component.
    // A SponsoringContainer component.
    // A KPIContainer component with totalTours, totalConnections, totalRanges, totalCities, city, and totalProvider props.
    // A FooterLinks component with listAllCityLinks(allCities, searchParams) as the links prop.
    // A FooterLinks component with listAllRangeLinks(allRanges, searchParams) as the links prop.
    // A Footer component. 
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

//description:
// mapDispatchToProps is an object used in Redux to map action creators to the props of a component. In this code, it maps the action creators loadFavouriteTours, loadCities, loadRanges, loadTourConnectionsExtended, loadTourConnections, loadTotalTours, and loadAllCities to the props of the component. This means that when the component is connected to the Redux store, it will have access to these action creators as props, which it can use to dispatch actions to the store.
// For example, if the component needs to load some data from an API, it can call the loadFavouriteTours action creator, which will dispatch an action to the store that triggers the data loading process. This pattern makes it easier to reuse action creators across multiple components and to test the components in isolation.
const mapDispatchToProps = {
    loadFavouriteTours,
    loadCities,
    loadRanges,
    loadTourConnectionsExtended,
    loadTourConnections,
    loadTotalTours,
    loadAllCities
};

// description:
// This is a constant called mapStateToProps which is a function that takes in a state object as an argument. This function returns an object that contains properties derived from the state object, specifically properties that are related to tours, ranges, cities, and other data related to tours and their connections.
// The properties that are being derived from the state object are:
// * loading: the loading status of the tours
// * favouriteTours: the favourite tours in the state
// * favouriteRanges: the favourite ranges in the state
// * allRanges: all the ranges in the state
// * totalTours: the total number of tours in the state
// * totalConnections: the total number of connections in the state
// * totalRanges: the total number of ranges in the state
// * totalCities: the total number of cities in the state
// * allCities: all the cities in the state
// * totalProvider: the total number of providers in the state
// These properties are being used to keep track of the state of the tours, ranges, cities, and other data related to tours and their connections.
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

// description:
// The code exports a higher-order component (HOC) that is the result of composing the "Start" component with the "connect" function from the "react-redux" library. The "connect" function connects the "Start" component to the Redux store, allowing it to access the state stored in the store and dispatch actions to the store.
// The "connect" function takes two arguments: "mapStateToProps" and "mapDispatchToProps". "mapStateToProps" is a function that maps the state in the Redux store to the props in the "Start" component. "mapDispatchToProps" is an object that maps the dispatch actions to the props in the "Start" component.
// The result of this composition is a new component that has access to the state in the Redux store and the ability to dispatch actions to the store, and is then exported for use in other parts of the application.
export default compose(
    connect(                    //connects the component Start to the redux store
        mapStateToProps,
        mapDispatchToProps
    ),
)(Start)
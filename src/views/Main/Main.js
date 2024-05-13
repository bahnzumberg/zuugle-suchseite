import * as React from "react";
import { lazy, useEffect, useState, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import { compose } from "redux";
import { connect } from "react-redux";
import {
  clearTours,
  loadFilter,
  loadTour,
  loadTourConnections,
  loadTourConnectionsExtended,
  loadTours,
} from "../../actions/tourActions";
import { hideModal, showModal } from "../../actions/modalActions";
import { loadAllCities } from "../../actions/cityActions";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import TourMapContainer from "../../components/Map/TourMapContainer";
import { loadGPX } from "../../actions/fileActions";
import { Typography } from "@mui/material";
import {
  checkIfSeoPageCity,
  // checkIfSeoPageRange,
  getPageHeader,
  getCityLabel,
} from "../../utils/seoPageHelper";
import { loadRanges } from "../../actions/rangeActions";
import DomainMenu from "../../components/DomainMenu";
import LanguageMenu from "../../components/LanguageMenu";
import { useTranslation } from "react-i18next";
import ArrowBefore from "../../icons/ArrowBefore";
import { consoleLog, getValuesFromParams } from "../../utils/globals";
import MapBtn from '../../components/Search/MapBtn';
import {getMapData} from '../../actions/crudActions';
import { checkOnlyMapParams } from "../../utils/map_utils";

const Search = lazy(() => import("../../components/Search/Search"));
const TourCardContainer = lazy(() =>
  import("../../components/TourCardContainer")
);


export function Main({
  loadTours,
  loadTour,
  loadAllCities,
  tours,
  totalTours,
  loadTourConnections,
  filter,
  pageTours,
  loading,
  allCities,
  loadRanges,
  // clearTours,
  // allRanges,
  // showModal,
  // hideModal,
  // loadFilter,
  // isLoadingFilter,
  // loadGPX,
  // loadTour,
  // loadTourConnectionsExtended,
}) {


// try {
//   if (typeof filter === "string" && filter.length > 0) {
//     filter = JSON.parse(filter);
//     // Valid JSON data
//   } else if (typeof filter === "object") {
//     // Object is already valid --> do nothing
//   } else {
//     filter = {};
//   }
// } catch (error) {
//   // case of JSON parsing error
//   console.error(" Main : Error parsing JSON:", error);
//   filter = {}; 
// }


  const navigate = useNavigate();
  const location = useLocation();
  const { t }    = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  // const [mapView, setMapView]           = useState(false);
  const [directLink, setDirectLink]     = useState(null);
  const [tourID, setTourID]             = useState(null);
  const [activeFilter, setActiveFilter] = useState(false); // State used inside Search and TourCardContainer
 
  const [filterValues, setFilterValues] = useState(null); // pass this to both Search and TourCardContainer
  const [counter, setCounter] = useState(0); 

  // const currentParams = new URLSearchParams(location.search);
  // const [forceUpdate, setForceUpdate] = useState(false);
  const [scrollToTop, setScrollToTop] = useState(false);

  const [showMap, setShowMap] = useState(false);
  

  // filter values in localStorage:
  let filterCountLocal = !!localStorage.getItem("filterCount") ? localStorage.getItem("filterCount") : null;
  let filterValuesLocal = !!localStorage.getItem("filterValues") ? localStorage.getItem("filterValues") : null; 
  
  //is true if params contains "filter" and has only 2 params specific to coordinate values
  const onlyMapParams = checkOnlyMapParams(searchParams.get('filter'));

// trials / testing
//   useEffect(() => {
//     let markersArrayArrivals = [];
//     if(!!tours){
//       tours.map(tour => {
//         markersArrayArrivals.push([tour.connection_arrival_stop_lat, tour.connection_arrival_stop_lon]);
//         // console.log("L117 / id :", tour.id)
//         // console.log("L118 / connection_arrival_stop_lat :", tour.connection_arrival_stop_lat)
//         // console.log("L119 / connection_arrival_stop_lon :",  tour.connection_arrival_stop_lon)
//         return markersArrayArrivals
//       })
//     }

//     // if(markersArrayArrivals ){
      
//     //     for(let j=0  ; j<markersArrayArrivals.length ; j++){
//     //       console.log(`row : ${j}`)
//     //       console.log(`${markersArrayArrivals[j][0]} , ${markersArrayArrivals[j][1]}`)
//     //     }     
      
//     // }
// }, [])
  
  useEffect(() => {
     
    setShowMap(searchParams.get('map') === "true" ? true : false ) ;
    // should be run at the begining and everytime map changes 
    let filterFromParams = !!searchParams.get('filter') ? searchParams.get('filter') : null;
    if(!!filterFromParams) {

      let values = getValuesFromParams(searchParams);
      !!values && console.log("L128 loadTours call / values : ", values); 

//  should values be prepared after they arrive from getValuesFromParameters() ???
      
//TODO : add condition -> if map filter contains map coordinates (?) then call getMapData
      
      // getMapData(values).then((res)=>{
      //   res?.data_received && console.log("L166 res?.data_received/ Map :", res.data_received)
      //   res?.data && console.log("L167 res.data/ Map data :", res.data)
      // });
      // console.log("Main.1")
    }
  }, [searchParams]); 

  useEffect(() => {
    // should be run at the begining only
  
    let values = getValuesFromParams();
    !!values && console.log("L128 loadTours call / values : ", values);
    
    loadTours(values).then((res) => {    //the redux state tours is filled by calling loadTours
      // set 'filterValues' in localStorage ?
    });
    console.log("Main.2")
  }, []); 

  useEffect(() => {
    if (scrollToTop) {
      window.scrollTo({ top: 0 , behavior: 'smooth'});
    }
    console.log("Main.3")
  }, [scrollToTop]);
  
  
  useEffect(() => {
    loadAllCities();
    loadRanges({ ignore_limit: true, remove_duplicates: true });
    let searchParamCity = searchParams.get("city");
    const city = localStorage.getItem("city");
    if (!!city && !!!searchParamCity) {
      searchParams.set("city", city);
      setSearchParams(searchParams);
    }
    console.log("Main.4")
  }, []);

  useEffect(() => {
    if(!!location && !!allCities && allCities.length > 0){
      const cityLabel = location && allCities ? t(`${getCityLabel(location, allCities)}`) : "VV";
      getPageHeader({ header: `Zuugli boy ${cityLabel}` });
    }
  },[allCities,location])

  
  useEffect(() => {
    var _mtm = window._mtm = window._mtm || [];
    _mtm.push({'pagetitel': "Suche"});
  }, []);


  useEffect(() => {
    if (
      !!location &&
      location.pathname &&
      allCities &&
      allCities.length > 0 
    ) {

      const city = checkIfSeoPageCity(location, allCities);
      if (!!city && city.value) {
        searchParams.set("city", city.value);
        setSearchParams(searchParams);
        setDirectLink({
          header: t(`main.oeffi_bergtouren_fuer_cityname`, { "city.label": city.label }),
          description: t(`main.alle_bergtouren_von_cityname`, { "city.label": city.label }),
        });
      }
      else if(!!!city || !!!city.value){
        setDirectLink(null);
      }
    }
    // if (location && location.pathname !== "/suche") {
    //   navigate("/");
    // }
    console.log("Main.5")
  }, [allCities]);

  //updates the state of activeFilter, filterValues and mapView based on the searchParams and filter values whenever there is a change in either searchParams or filter.
  useEffect(() => {
    //when onlyMapParams = true : map positions inside "filter" param is the only one set, means proper filter modal was not submitted/ set, therefore we setActiveFilter should be set to false. 
    // (!!filterCountLocal && filterCountLocal > 0) || !onlyMapParams ? 
    (!!filterCountLocal && filterCountLocal > 0) ? 
    setActiveFilter(true) : setActiveFilter(false);
    !!filterValuesLocal ? setFilterValues(filterValuesLocal) : setFilterValues({});
    //updates the state of mapView based on the value of map in searchParams. If map is equal to "true", then mapView is set to true, otherwise it remains set to initial value of false.
    // setMapView(searchParams.get("map") === "true");
    console.log("Main.6")
  }, [filterCountLocal,filterValuesLocal, searchParams]);

useEffect(() => {
  // !!location?.state?.params && console.log("L228 location.state.params :", location?.state?.params)
  if (!!location && !!location.state && !!location.state.params  ) {
    console.log("L228 location.state.params :", location?.state?.params)
  }
}, [location])

  const backBtnHandler = (e)=> {
    e.preventDefault();
    // if(!!searchParams.get('map')) {
    //   searchParams.delete('map');
    // }
    if(searchParams.get('range')){
      searchParams.delete('range');
    }
    setSearchParams(searchParams);
    goToStartPage();
  }

  const goToStartPage = () => {
    //remove map param here 
    navigate(`/?${searchParams.toString()}`, { replace: true });
  };

  const onSelectTour = (tour) => {
    const city = !!searchParams.get("city") ? searchParams.get("city") : null;
    if (!!tour && !!tour.id ) {
      // if(!!city){
        loadTour(tour.id, city)
          .then((tourExtracted) => {
            if (tourExtracted && tourExtracted.data && tourExtracted.data.tour) {
              localStorage.setItem("tourId", tour.id);
              // window.open("/tour?" + searchParams.toString());
            }else{
              goToStartPage();
            }
          })
    }else{
      goToStartPage();
    }
  };

 //Map-related : a callback function that selects a tour with a specific id
 const onSelectTourById = useCallback((id) => {
  onSelectTour({ id: id });
}, []);

  const memoTourMapContainer = useMemo(() => {
    return (
      <TourMapContainer
        tours={tours}
        onSelectTour={onSelectTourById}
        setTourID={setTourID}
        filter={filter}
        totalTours={totalTours}
      />
    );
  }, [filter,onSelectTourById,setTourID,tours, totalTours]);

  
  const toggleMapHandler = ()=> {
    console.log("L303 searchParams ", searchParams.toString())
    if (searchParams.has('map') && (searchParams.get('map') === 'true')) {
      // removeMapParam
      searchParams.delete('map');
      //add filter values from localStorage ?  here or inside the mapcontainer ?
      setSearchParams(searchParams)
      setShowMap(false);
      console.log("Main.7")
    }else{
      console.log("L310 searchParams ", searchParams.toString())
      searchParams.set('map', true)
      //add filterValues from localStorage ? here or inside the mapcontainer ?
      setSearchParams(searchParams)
      setShowMap(true)
      console.log("Main.8")
    }
  }

  const renderCardContainer = ()=> (
    <Box
      // className={
      //   "cards-container" +
      //   (!!directLink && !!directLink.header ? " seo-page" : "")
      // }
      className="cards-container"
      sx={{
        marginTop: {
          xs: marginTop,
          md: marginTop,
        },
        padding: "25px"
      }}
    >
      <TourCardContainer
        onSelectTour={onSelectTour}
        tours={tours}
        loadTourConnections={loadTourConnections}
        city={searchParams.get("city")}
        loadTours={loadTours}
        // totalTours={totalTours}
        pageTours={pageTours}
        loading={loading}
        // total={totalTours}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        showMap={showMap}  //to be used for other features
      />
    </Box>
  )

  let paddingTop = showMap ? "35px" : "50px"
  let marginTop = showMap ? "20px" : "255px"

  const totalToursHeader = ()=>(   
    <Box elevation={0} className={"header-line-main"}>
          <Box
            sx={{
              paddingTop: paddingTop,
              paddingBottom: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color={"black"} sx={{ textAlign: "center" }}>
              {Number(totalTours).toLocaleString()}{" "}
              {totalTours === 1 ? ` ${t("main.ergebnis")}` : ` ${t("main.ergebnisse")}`}
            </Typography>
            {(!!filterCountLocal && filterCountLocal > 0 )   
            // {(!!filterCountLocal && filterCountLocal > 0 && (!!!onlyMapParams) )   
            && (
              <Box display={"flex"} alignItems={"center"}>
                &nbsp;{" - "}&nbsp;
                <Typography
                  sx={{
                    fontSize: "16px",
                    color: "#FF7663",
                    fontWeight: "600",
                    mr: "2px",
                  }}
                >
                  {t("filter.filter")}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
  )

 
  return (
    <div>
        <Box sx={{ width: "100%" }} className={"search-result-header-container"}>
        {!!directLink && (
          <Box className={"seo-bar"}>
            <Typography
              variant={"h1"}
              sx={{ color: "#fff", fontSize: "18px", marginBottom: "5px" }}
            >
              {directLink.header}
            </Typography>
            <Typography variant={"h2"} sx={{ fontSize: "14px" , color: "#fff"}}>
              {directLink.description}
            </Typography>
          </Box>
        )}
        {/* new top header */}
        {/* {getPageHeader({ header: `Zuugle ${cityLabel}` })} */}
        <Box
          className="newHeader"
          sx={{
            height: {
              xs: "170px",
              md: "165px",
            },
          }}
          position={"relative"}
        >
          <Box component={"div"} className="rowing blueDiv">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ mr: "16px", cursor: "pointer" }}>
                 <Link
                  to={{
                    pathname: "/",
                  }}
                  onClick={backBtnHandler}
                  replace
                >
                  <ArrowBefore
                    style={{ stroke: "#fff", width: "34px", height: "34px" }}
                  />
                </Link>
              </Box>
              <DomainMenu />
            </Box>
            <LanguageMenu />
          </Box>
          {!!allCities && allCities.length > 0 && (
            <Box
              alignItems={"center"}
              justifyContent={"center"}
              display="inline-block"
              sx={{
                position: "absolute",
                bottom: "0",
                left: "50%",
                transform: "translate(-50%,50%)",
                backgroundColor: "#FFF",
                borderRadius: "15px",
                padding: "12px 24px",
                border: "2px solid #ddd",
                boxShadow: "rgba(100, 100, 111, 0.3) 0px 3px 20px 0px",
                boxSizing: "border-box",
                width: {
                  md: "600px",
                  lg: "600px",
                },
                maxWidth: {
                  xs: "325px",
                  md: "600px",
                },
              }}
            >
              <Box elevation={1} className={"colCenter"}>
                <Search 
                  isMain={true} 
                  page="main" 
                  activeFilter = {activeFilter}
                  filterValues = {filterValues}
                  setFilterValues = {setFilterValues}
                  counter = {counter}
                  setCounter = {setCounter}
                />
              </Box>
            </Box>
          )}
        </Box>
        {!showMap && (
         totalToursHeader()
        )}
      </Box>
 
      {!!tours && tours.length > 0 && (
        <>
          {!!showMap ? (
            <>
              <Box className={"map-container"}>
                {memoTourMapContainer}
              </Box>
              {totalToursHeader()}
              {renderCardContainer()}
              
            </>
          ) : 
            renderCardContainer()
          }
          (
          <MapBtn  showMap={showMap} onClick={toggleMapHandler} />
                   
        </>
      )}
    </div>
  );
}

const mapDispatchToProps = {
  loadTours,
  loadAllCities,
  showModal,
  hideModal,
  loadTourConnections,
  loadTourConnectionsExtended,
  loadFilter,
  // loadGPX,
  loadTour,
  clearTours,
  loadRanges,
};

const mapStateToProps = (state) => {

  return {
    loading: state.tours.loading,
    tours: state.tours.tours,
    allCities: state.cities.all_cities,
    allRanges: state.ranges.ranges,
    filter: state.tours.filter,
    totalTours: state.tours.total,
    pageTours: state.tours.page,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Main);

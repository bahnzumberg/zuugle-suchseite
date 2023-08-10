import * as React from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import {loadFavouriteTours, loadTours} from "../../actions/tourActions"
import {compose} from "redux"
import {connect} from "react-redux"
import {loadCities} from "../../actions/cityActions"
import {Fragment, useEffect, useState} from "react"
import {loadRegions} from "../../actions/regionActions"
import {useSearchParams} from "react-router-dom"
import {
    // isResponsive,
    parseIfNeccessary,
    setOrRemoveSearchParam,
} from "../../utils/globals"
import {useNavigate} from "react-router"
import {hideModal, showModal} from "../../actions/modalActions"
import FullScreenCityInput from "./FullScreenCityInput"
import {useTranslation} from "react-i18next";
import i18next from 'i18next';
import FilterIcon from "../../icons/FilterIcon"
import IconButton from "@mui/material/IconButton"
import GoIcon from "../../icons/GoIcon"
import AutosuggestSearchTour from "./AutosuggestSearch";
import Filter from "../Filter/Filter";



export function Search({
  loadRegions,
  loadTours,
  goto,
  isMain,
  showModal,
  hideModal,
  allCities,
  isMapView,
  // loadCities,
  // cities,
  // regions, // DO WE NEED regions ?? see L87, also note that regions redux state is mapped to props below
  // isCityLoading,
  // loadFavouriteTours,
}) {

    //navigation
    const navigate = useNavigate();
    // Translation
    const { t } = useTranslation();
    let language = i18next.resolvedLanguage;
    useEffect(() => {
        setPlaceholder(t("start.suche"));
    }, [language]);

    //initialisation
    const [placeholder, setPlaceholder] = useState(t("start.suche"));
    const [searchParams, setSearchParams] = useSearchParams();
    const [cityInput, setCityInput] = useState("");
    const [searchPhrase, setSearchPhrase] = useState("");
    let suggestion; //variable that stores the text of the selected option
    let autoSearchPhrase; //variable that stores the typed text, in case you don't use any suggestion
    const [city, setCity] = useState(null);
    const [region, setRegion] = useState(null);
    const [activeFilter, setActiveFilter] = useState(false);
    const initialIsMapView = isMapView || false;


  useEffect(() => {
    // pull out values from URL params
    let city = searchParams.get("city");
    let range = searchParams.get("range");// does not showup in params list in latest version
    let state = searchParams.get("state");// does not showup in params list in latest version
    let country = searchParams.get("country");// does not showup in params list in latest version
    let type = searchParams.get("type"); // does not show up in params list in latest version
    let search = searchParams.get("search");
    let filter = searchParams.get("filter");
    let orderId = searchParams.get("sort");
    let provider = searchParams.get("p");

    if (!!city && !!allCities) {
      const cityEntry = allCities.find((e) => e.value == city); // find the city object in array "allCities"
      if (!!cityEntry) {
        setCityInput(cityEntry.label); // set the state "cityInput" to this city LABEL / string value
        setCity(cityEntry); // state "city" to city OBJECT, e.g. {value: 'amstetten', label: 'Amstetten'}
        writeCityToLocalStorage(city); // store the city NAME in local storage

        /** load regions initially */
        loadRegions({ city: city }); // when is regions needed?
      }
    }

    if (!!!orderId || orderId == "relevanz") {
      searchParams.set("sort", "relevanz");
      setSearchParams(searchParams);
    }

    // range does not showup in params list in latest version
    if (!!range) {
      console.log("L99 Search : region in useEffect : " + range);
      setSearchPhrase(range);         
      setRegion({ value: range, label: range, type: "range" });
    }
    
    if (!!search) {
      setSearchPhrase(search);
    }
    // state does not showup in params list in latest version
    if (!!state) {
      setSearchPhrase(state);
      setRegion({ value: state, label: state, type: "state" });
    }
    // country does not showup in params list in latest version
    if (!!country) {
      setSearchPhrase(country);
      setRegion({ value: country, label: country, type: "country" });
    }
    // type does not showup in params list in latest version
    if (!!type) {
      setSearchPhrase(type);
      setRegion({ value: type, label: type, type: "type" });
    }


    //return if start page - no load
    if (!!!isMain) {
      return;
    }
    let _filter = !!filter ? parseIfNeccessary(filter) : null; //wenn es einen Filter gibt, soll der Filter richtig formatiert werden: maxAscend: 3000im jJSON format, statt: "maxAscend": 3000
    if (!!_filter) {
      filter = {
        ..._filter,
        ignore_filter: true,
      };
    } else {
      filter = {
        ignore_filter: true,
      };
    }
   
    // let result = loadTours({
    loadTours({
      city: city,
      range: range, //does not showup in params list in latest version
      state: state,//does not showup in params list in latest version
      country: country,//does not showup in params list in latest version
      type: type,//does not showup in params list in latest version
      search: search,
      filter: filter,
      sort: orderId,
      provider: provider,
      map: searchParams.get("map"),
    });
    // result.then((resolvedValue) => {
    //     console.log("result of load Tours", resolvedValue);
    // });
  }, [
    // useEffect dependencies
    searchParams && searchParams.get("city"),
    searchParams && searchParams.get("filter"),
    searchParams && searchParams.get("sort"),
    searchParams && searchParams.get("search"),
    searchParams && searchParams.get("type"),
    searchParams && searchParams.get("sort"),
    searchParams && searchParams.get("range"),
    searchParams && searchParams.get("map"),
    searchParams && searchParams.get("p"),
  ]); // end useEffect

  // store city in localstorage
  const writeCityToLocalStorage = (city) => {
    localStorage.setItem("city", city);
  };

  // Filter related starts here
  const openFilter = () => {
    // console.log("inside openFilter L242")
    showModal("MODAL_COMPONENT", {
      CustomComponent: Filter,
      title: "Filter",
      modalSize: "lg",
      doSubmit: handleFilterSubmit,
      resetFilter: handleResetFilter,
      onBack: () => {
        hideModal();
        console.log("onBack called L256");
      },
      searchParams,
      setSearchParams,
    });
  };

  const handleFilterSubmit = ({ filterValues }) => {
    hideModal();
    handleFilterChange(filterValues);
  };

  const handleResetFilter = () => {
    hideModal();
    handleFilterChange(null);
  };

  const handleFilterChange = (entry) => {
    if (entry == null) {
      searchParams.delete("filter");
    } else {
      searchParams.set("filter", JSON.stringify(entry));
    }
    setSearchParams(searchParams);
  };

  // search handling function
  const search = (tempRegion = null) => {
    let values = {};
    if (!!city && !!city.value) {
      values.city = city.value;
    }

    let _region = region;
    if (!!tempRegion) {
      _region = tempRegion;
    }
    if (!!_region && !!_region.value) {
      values[_region.type] = _region.value;
    }
    // assign values.search
    values.search = suggestion
      ? suggestion
      : autoSearchPhrase
      ? autoSearchPhrase
      : "";

    if (!!searchParams.get("sort")) {
      values.sort = searchParams.get("sort");
    } else {
      values.sort = "relevanz";
    }

    values.map = searchParams.get("map"); // map related
    values.provider = searchParams.get("p");
    // console.log("HLO: ", searchParams);
    //searchParams.delete("filter"); // why delete filter values? if they exist?

    setOrRemoveSearchParam(searchParams, "city", values.city);
    setOrRemoveSearchParam(searchParams, "range", values.range);//does not showup in params list 
    setOrRemoveSearchParam(searchParams, "search", values.search);
    setOrRemoveSearchParam(searchParams, "state", values.state);//does not showup in params list 
    setOrRemoveSearchParam(searchParams, "country", values.country);//does not showup in params list 
    setOrRemoveSearchParam(searchParams, "type", values.type);//does not showup in params list 

    setSearchParams(searchParams);
    
    if (!!goto) {
      navigate(goto + "?" + searchParams);
    } else {
    //   console.log("values passed to loadTours :", values);
      loadTours(values).then((res) => {
        window.scrollTo({ top: 0 });
      });
    }
  }; // end search()

  const toggleFilter = () => {
    // code goes here for filter overlay
    console.log("Search.js toggleFilter() called");
    setActiveFilter(!activeFilter);
  };

  // const gotoHome = () => {
  //     let _city = searchParams.get("city")
  //     navigate(`/?${!!_city ? "city=" + _city : ""}`)
  // }

  const showCityModal = () => {
    showModal("MODAL_COMPONENT", {
      CustomComponent: FullScreenCityInput,
      searchParams,
      initialCity: cityInput,
      onSelect: (city) => {
        hideModal();
        if (!!city) {
          setCityInput(city.label);
          setCity(city);
        }
      },
      setSearchParams,
      title: "",
      modalSize: "lg",
      onBack: () => {
        hideModal();
      },
    });
  };

  // does not showup in params list in latest version 
  // const showRegionInput = () => {
  //     showModal("MODAL_COMPONENT", {
  //         CustomComponent: FullScreenRegionInput,
  //         searchParams,
  //         initialRegion: regionInput,
  //         onSelect: (region) => {
  //             hideModal()
  //             if (!!region) {
  //                 setRegionInput(region.value)
  //                 setRegion(region)
  //                 search(region)
  //             }
  //         },
  //         setSearchParams,
  //         title: "",
  //         modalSize: "lg",
  //         onBack: () => {
  //             hideModal()
  //         },
  //     })
  // }

  // const onCustomRegionSubmit = () => {
  //     setOpenRegionSearch(false)
  //     search()
  // }

  // const resetRegionInput = () => {
  //     setRegionInput("")
  //     setRegion(null)
  //     setOpenRegionSearch(false)
  //     searchParams.delete("search")
  //     searchParams.delete("range")
  //     searchParams.delete("type")
  //     setSearchParams(searchParams)
  // }

  //Function that gets value f the selected option and directly start the search for tours
  const getSearchSuggestion = (autoSuggestion) => {
    suggestion = autoSuggestion;
    search();
  };
  //Function that gives you the input text you need when no Suggestion was taken
  const getSearchPhrase = (searchPhrase) => {
    autoSearchPhrase = searchPhrase;
  };

  return (
    <Fragment>
      <Box className="main-search-bar">
        <Grid
          container
          display="flex"
          justifyContent="center"
          alignContent="center"
          alignItems="center"
        >
          <Grid item xs>
            <Box display="flex" alignItems="center" justifyContent="center">
              <AutosuggestSearchTour
                onSearchSuggestion={getSearchSuggestion}
                onSearchPhrase={getSearchPhrase}
                city={city}
                language={language}
                placeholder={searchPhrase}
              />
            </Box>
          </Grid>

          <Grid item>
            <Box className="search-bar--divider" />
          </Grid>

          <Grid item xs onClick={showCityModal}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{ marginRight: "10px", marginLeft: "20px" }}
            >
              <span className="search-bar--city">
                {cityInput.length > 0 ? cityInput : t("start.heimatbahnhof")}
              </span>
            </Box>
          </Grid>
          <Grid item>
            {!!initialIsMapView ? null : (
              <Box sx={{ marginLeft: "10px" }} className="filter-icon-container">
                {!!isMain ? (
                  <IconButton
                    onClick={() => openFilter()}
                    // onClick={toggleFilter}
                     
                  >
                    <FilterIcon
                        style={{
                            transition: "stroke 0.3s",
                            // transform: "scale(0.675)",
                            // stroke: activeFilter ? "white" : "blue",
                            strokeWidth: 1.25,
                            // borderRadius: "50%",
                            // border: "2px solid gray",
                            // padding: "8px"
                        }}
                    />

                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => search()}
                    sx={{
                      "&:hover": {
                        background: "#7aa8ff",
                        fill: "#7aa8ff",
                      },
                    }}
                  >
                    <GoIcon
                      style={{
                        transform: "scale(1.55)",
                        strokeWidth: 0,
                      }}
                    />
                  </IconButton>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
}

const mapDispatchToProps = {
    loadCities,
    loadRegions,
    loadTours,
    loadFavouriteTours,
    showModal,
    hideModal,
}

const mapStateToProps = (state) => {
    return {
        loading: state.tours.loading,
        cities: state.cities.cities,
        allCities: state.cities.all_cities,
        regions: state.regions.regions,
        isCityLoading: state.cities.loading,
        isRegionLoading: state.regions.loading,
    }
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(Search)

// L57: 
// console.log("Search arguments received: "); // output
// console.log("Search arguments :loadRegions ",loadRegions); //(...args) => dispatch(actionCreator(...args));
// console.log("Search arguments : loadTours", loadTours); //(...args) => dispatch(actionCreator(...args));
// console.log("Search arguments , goto value :", goto); //     '/suche'
// console.log("Search arguments : isMain", isMain);  //undefined
// console.log("Search arguments : showModal", showModal);//(...args) => dispatch(actionCreator(...args));
// console.log("Search arguments : hideModal ", hideModal);//(...args) => dispatch(actionCreator(...args));
// console.log("Search arguments : allCities ", allCities[0]); //{value: 'amstetten', label: 'Amstetten'}
// console.log("Search arguments : isMapView ", isMapView); // undefined

//L66
// const handleFocus = () => {
//     setRegionInput("");
//     setPlaceholder("");
//   };

//   const handleBlur = () => {
//     setPlaceholder(t("start.suche"));
//   };

//L79
// clgs :
// only the following have actually changed , not necessarily in same instant : "city", "range", "orderId", "filter", rest remained null
//console.log("searchParams ", JSON.stringify(searchParams)); //output:  searchParams  {};
// console.log("city", city);
// console.log("range", range);
// console.log("state", state);
// console.log("country", country);
// console.log("type", type);
// console.log("search", search);
// console.log("filter", filter);
// console.log("orderId", orderId);
// console.log("provider", provider);

//L142
//clgs
// console.log("city", city);
// console.log("range", range);
// console.log("state", state);
// console.log("country", country);
// console.log("type", type);
// console.log("search", search);
// console.log("filter", filter);
// console.log("orderId", orderId);
// console.log("provider", provider);
//for (const entry of searchParams.entries()) {
//    console.log("searchParams entries : ",entry); //output : ['city', 'bischofshofen'] ['sort', 'relevanz']
//}

//L124
// console.log("Search...search inside useEffect :", search);
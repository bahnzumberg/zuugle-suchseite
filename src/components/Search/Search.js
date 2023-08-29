import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { loadFavouriteTours, loadTours } from "../../actions/tourActions";
import { compose } from "redux";
import { connect } from "react-redux";
import { loadCities } from "../../actions/cityActions";
import { Fragment, useEffect, useState } from "react";
import { loadRegions } from "../../actions/regionActions";
import { useSearchParams } from "react-router-dom";
import {
  // isResponsive,
  parseIfNeccessary,
  setOrRemoveSearchParam,
} from "../../utils/globals";
import { useNavigate } from "react-router";
import { hideModal, showModal } from "../../actions/modalActions";
import FullScreenCityInput from "./FullScreenCityInput";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import FilterIcon from "../../icons/FilterIcon";
import IconButton from "@mui/material/IconButton";
import GoIcon from "../../icons/GoIcon";
import AutosuggestSearchTour from "./AutosuggestSearch";
import Filter from "../Filter/Filter";
import SearchIcon from "../../icons/SearchIcon";
import TransportTrain from "../../icons/TransportTrain";

export function Search({
  loadRegions,
  loadTours,
  goto,
  page,
  pageKey,
  isMain,
  showModal,
  hideModal,
  allCities,
  isMapView,
  filter,
  // loadCities,
  // cities,
  // regions, 
  // isCityLoading,
  // loadFavouriteTours,
}) {

  //navigation
  const navigate = useNavigate();
  // Translation
  const { t } = useTranslation();
  let language = i18next.resolvedLanguage;

  //set placeholder
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
  const [activeFilter, setActiveFilter] = useState("");
  const initialIsMapView = isMapView || false;

  useEffect(() => {
    let activeFilterStorage = localStorage.getItem('activeFilter')
    setActiveFilter(activeFilterStorage)
  }, []);

  useEffect(() => {
    // pull out values from URL params
    let city = searchParams.get("city");
    let range = searchParams.get("range"); // does not showup in params list in latest version
    let state = searchParams.get("state"); // does not showup in params list in latest version
    let country = searchParams.get("country"); // does not showup in params list in latest version
    let type = searchParams.get("type"); // does not show up in params list in latest version
    let search = searchParams.get("search");
    let filter = searchParams.get("filter");
    let orderId = searchParams.get("sort");
    let provider = searchParams.get("p");
    if (pageKey === "detail") {
      if (!!city) {

        // console.log("L90 city: " + city);
        setCityInput(city); // state "city" to city OBJECT, e.g. {value: 'amstetten', label: 'Amstetten'}
        writeCityToLocalStorage(city); // store the city NAME in local storage

        /** load regions initially */
        loadRegions({ city: city }); // when is regions needed?
      }
    }
    else {
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
    }

    // if (!!city) {
    //     setCityInput(city.label); // set the state "cityInput" to this city LABEL / string value
    //     setCity(city); // state "city" to city OBJECT, e.g. {value: 'amstetten', label: 'Amstetten'}
    //     writeCityToLocalStorage(city); // store the city NAME in local storage

    //     /** load regions initially */
    //     loadRegions({ city: city }); // when is regions needed?
    // }

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
      state: state, //does not showup in params list in latest version
      country: country, //does not showup in params list in latest version
      type: type, //does not showup in params list in latest version
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
      page: "main",
      modalSize: "lg",
      doSubmit: handleFilterSubmit,
      resetFilter: handleResetFilter,
      onBack: () => {
        hideModal();
        // console.log("onBack called L256");
      },
      searchParams,
      setSearchParams,
    });
  };

  const handleFilterSubmit = ({ filterValues, filterCount }) => {
    hideModal();
    handleFilterChange(filterValues);
    if (filterCount > 0) {
      localStorage.setItem('activeFilter', true);
      setActiveFilter(true)
    }
    else {
      localStorage.setItem('activeFilter', "");
      setActiveFilter("")
    }

  };

  const handleResetFilter = () => {
    hideModal();
    handleFilterChange(null);
    localStorage.setItem('activeFilter', "");
    setActiveFilter("")
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
    setOrRemoveSearchParam(searchParams, "range", values.range); //does not showup in params list
    setOrRemoveSearchParam(searchParams, "search", values.search);
    setOrRemoveSearchParam(searchParams, "state", values.state); //does not showup in params list
    setOrRemoveSearchParam(searchParams, "country", values.country); //does not showup in params list
    setOrRemoveSearchParam(searchParams, "type", values.type); //does not showup in params list

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
    // console.log("Search.js toggleFilter() called");
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
      title: t("start.heimatbahnhof"),
      page: page,
      srhBoxScrollH: document.querySelector(".main-search-bar").getBoundingClientRect().top,
      modalSize: "lg",
      onBack: () => {
        hideModal();
      },
    });
  };
  const showSearchModal = () => {
    showModal("MODAL_COMPONENT", {
      CustomComponent: AutosuggestSearchTour,
      onSearchSuggestion :getSearchSuggestion,
      onSearchPhrase: getSearchPhrase,
      city: city,
      language: language,
      placeholder : searchPhrase,
      title : t("start.suche"),
      page: page,
      srhBoxScrollH: document.querySelector(".main-search-bar").getBoundingClientRect().top,
      modalSize: "lg",
    });
  };

  // const showRangeModal = () => {

  //   showModal("MODAL_COMPONENT", {
  //     onSearchSuggestion: getSearchSuggestion,
  //     onSearchPhrase: getSearchPhrase,
  //     city: city,
  //     language: language,
  //     placeholder: searchPhrase,
  //     CustomComponent: FullScreenCityInput,
  //     searchParams,
  //     initialCity: cityInput,
  //     onSelect: (city) => {
  //       hideModal();
  //       if (!!city) {
  //         setCityInput(city.label);
  //         setCity(city);
  //       }
  //     },
  //     setSearchParams,
  //     title: "",
  //     page: page,
  //     srhBoxScrollH: document.querySelector(".main-search-bar").getBoundingClientRect().top,
  //     modalSize: "lg",
  //     onBack: () => {
  //       hideModal();
  //     },
  //   });
  // };

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
    hideModal();
  };

  //Function that gives you the input text you need when no Suggestion was taken
  const getSearchPhrase = (searchPhrase) => {
    autoSearchPhrase = searchPhrase;
  };

  return (
    <Fragment>
      <Box
        className="main-search-bar"
        sx={{
          // width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {!cityInput && pageKey ? <TransportTrain style={{ strokeWidth: "1px", fill: "#000", stroke: "none" }} />
            : <SearchIcon
              style={{ strokeWidth: 1, stroke: "#101010", fill: "#101010" }}
            />}
          <Box sx={{ width: { xs: !cityInput && pageKey === "detail" ? "100%" : "200px", md: !cityInput && pageKey === "detail" ? "100%" : "486px" } }}>
            <Grid container>
              <Grid
                item
                xs={12}
                md={!cityInput && pageKey === "detail" ? 12 : 6}
                sx={{ paddingRight: "16px", padding: 0 }}
              onClick={showSearchModal}
              >
                {!cityInput && pageKey === "detail" && 
                  <Box sx={{
                    textAlign: "left", ml: "14px", color: "#101010",
                    fontFamily: "Open Sans",
                    fontSize: { xs: "14px", sm: "15px" },
                    fontWeight: "500",
                    lineHeight: "20px",
                  }}>
                    {t("search.um_reise_berechnen_zu_koenen")}
                  </Box>
                 }
                 <Box
                  sx={{
                    borderLeft: {
                      sm: 0, md: !cityInput && pageKey === "detail" ? 0 : "2px solid #DDDDDD"
                    },
                    paddingLeft: "14px",
                  }}
                >
                  {pageKey !== "detail" ? (<span className="search-bar--city">
                    {searchPhrase.length > 0
                      ? searchPhrase
                      : t("start.suche")}
                  </span>) : (
                    !searchPhrase && pageKey === "detail" ? <Box className="search-bar--city" sx={{
                      cursor: "pointer",
                      color: "#4992FF !important",
                      fontFamily: "Open Sans",
                      fontSize: { xs: "14px", sm: "15px" },
                      fontWeight: "700",
                      lineHeight: "20px"

                    }}>
                      {t("start.suche")}
                    </Box> : <Box className="search-bar--city">{searchPhrase}</Box>
                  )}

                </Box>
              </Grid>
              {/* city -----   modal ----  below */}
              <Grid
                item
                sm={12}
                md={!cityInput && pageKey === "detail" ? 12 : 6}
                onClick={showCityModal}
                display="flex"
                alignItems="center"
              >
                <Box
                  sx={{
                    borderLeft: {
                      sm: 0, md: !cityInput && pageKey === "detail" ? 0 : "2px solid #DDDDDD"
                    },
                    paddingLeft: "14px",
                  }}
                >
                  {pageKey !== "detail" ? (<span className="search-bar--city">
                    {cityInput.length > 0
                      ? cityInput
                      : t("start.heimatbahnhof")}
                  </span>) : (
                    !cityInput && pageKey === "detail" ? <Box className="search-bar--city" sx={{
                      cursor: "pointer",
                      color: "#4992FF !important",
                      fontFamily: "Open Sans",
                      fontSize: { xs: "14px", sm: "15px" },
                      fontWeight: "700",
                      lineHeight: "20px"

                    }}>
                      {t("search.waehle_dein_heimatbahnhof")}
                    </Box> : <Box className="search-bar--city">{cityInput}</Box>
                  )}

                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box>
          {/* ***** filter box in the Main page ******* */}
          <Box>
            {!cityInput && pageKey === "detail" ? "" : !!initialIsMapView ? null : (
              <Box
                sx={{ marginLeft: "10px", backgroundColor: activeFilter && "#FF7663", borderColor: activeFilter && "#FF7663" }}
                className="filter-icon-container"
              >
                {!!isMain ? (
                  <IconButton
                    onClick={() => openFilter()}
                  // onClick={toggleFilter}
                  >
                    <FilterIcon
                      sx={{ transition: "stroke 0.3s", strokeWidth: 1.25, stroke: activeFilter ? "#fff" : "#101010" }}
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
          </Box>
        </Box>
      </Box>
    </Fragment >
  );
}

const mapDispatchToProps = {
  loadCities,
  loadRegions,
  loadTours,
  loadFavouriteTours,
  showModal,
  hideModal,
};

const mapStateToProps = (state) => {
  return {
    loading: state.tours.loading,
    cities: state.cities.cities,
    allCities: state.cities.all_cities,
    filter: state.tours.filter,
    regions: state.regions.regions,
    isCityLoading: state.cities.loading,
    isRegionLoading: state.regions.loading,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Search);

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

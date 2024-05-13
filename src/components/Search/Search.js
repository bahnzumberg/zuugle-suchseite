/* eslint-disable react-hooks/exhaustive-deps */
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
import { countFilterActive } from "../../utils/globals"


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
  updateCapCity,
  filter,
  counter,
  setCounter,
  setFilterValues, 
  filterValues,
  // showMobileMenu, setShowMobileMenu,
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


  //initialisation
  const [searchParams, setSearchParams] = useSearchParams();
  const [cityInput, setCityInput] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  let suggestion; //variable that stores the text of the selected option
  const urlSearchParams = new URLSearchParams(window.location.search);
  const cityParam = urlSearchParams.get("city");
  const [city, setCity] = useState({
    label: cityParam,
    value: cityParam,
  });

  const [region, setRegion] = useState(null);
  const initialIsMapView = isMapView || false;
  const [activeFilter, setActiveFilter] = useState(false)
  const [scrollToTop, setScrollToTop] = useState(false);

  useEffect(() => {
    if (scrollToTop) {
      window.scrollTo({ top: 0 , behavior: 'smooth'});
    }
  }, [scrollToTop]);
  
  useEffect(() => {
    const filterParamValue = searchParams.get('filter');
    if (filterParamValue) {
      setActiveFilter(!!counter && counter > 0);
    }
  }, [searchParams, counter]);

  useEffect(() => {
    // pull out values from URL params
    let city = searchParams.get("city");
    let range = searchParams.get("range"); 
    let state = searchParams.get("state"); 
    let country = searchParams.get("country"); 
    let type = searchParams.get("type"); 
    let search = searchParams.get("search");
    let filter = searchParams.get("filter");
    let sort = searchParams.get("sort");
    let provider = searchParams.get("p");
    let cityEntry = null;

    if (!!city && !!allCities) {
      cityEntry = allCities.find((e) => e.value === city); // find the city object in array "allCities"
    }

    if (!!city && !!allCities) {
      if (!!cityEntry) {
        setCityInput(cityEntry.label); // set the state "cityInput" to this city LABEL / string value
        setCity(cityEntry); // state "city" to city OBJECT, e.g. {value: 'amstetten', label: 'Amstetten'}
        writeCityToLocalStorage(city); // store the city NAME in local storage

        /** load regions initially */
        loadRegions({ city: city });
      }
    }

    //setting searchPhrase to the value of the search parameter
    //if there is a range selected then set searchPhrase to that range name
    if (!!range) {
      setSearchPhrase(range);
      setRegion({ value: range, label: range, type: "range" });
    }
    // todo : note that this code here checks if there is a search param ONLY if there is NO range param
    else if (!!search) {
      setSearchPhrase(search);  //TODO : do we need to do actual search if search is a city? see line 138 comment

      if (city === null && !search.includes(' ')) {
        // If a search phrase is given and city is empty and the search term consists only of one word,
        // we have to check, if the search term is a valid city_slug.If yes, we will store the search term as city. 
        let cityEntry = allCities.find((e) => e.value === search.toLowerCase()); // find the city object in array "allCities"
        if (!!cityEntry) {
          setCityInput(cityEntry.label); // set the state "cityInput" to this city LABEL / string value
          setCity(cityEntry);
          writeCityToLocalStorage(search.toLowerCase());
          searchParams.set("city", search.toLowerCase());
          setSearchParams(searchParams);
        }
      }
    }
    else if (!!state) {
      // state might be useful for future enhancement or new feature related to Klimaticket
      setSearchPhrase(state);
      setRegion({ value: state, label: state, type: "state" });
    }
    else if (!!country) {
      // country might be useful for future enhancement or new feature related to Klimaticket
      setSearchPhrase(country);
      setRegion({ value: country, label: country, type: "country" });
    }
    else if (!!type) {
      // type might be useful for future enhancement or new feature related to Klimaticket
      setSearchPhrase(type);
      setRegion({ value: type, label: type, type: "type" });
    }

    //Remaining code in this useEffect is for Main page only .
    //=======================================================
    if (!!!isMain ) {
      return;
    }
    let _filter = !!filter ? parseIfNeccessary(filter) : null; //wenn es einen Filter gibt, soll der Filter richtig formatiert werden: maxAscend: 3000im jJSON format, statt: "maxAscend": 3000
    // !!_filter && console.log(" L142 -> _filter is of †ype :", typeof(_filter))
    if (!!_filter) {
      filter = {
        ..._filter,
        ignore_filter: false,
      };
    } else {
      filter = {
        ignore_filter: true,
      };
    }
    // flag active filter if count > 0
    filter && setActiveFilter(countFilterActive(searchParams, filter) > 0);
     
    let result = loadTours({
      city: city,
      range: range, 
      state: state, 
      country: country, 
      type: type, 
      search: search,
      filter: filterValues ? filterValues : filter,  // get this from Filter.js (through Search and Main)
      sort: sort,
      provider: provider,
      map: searchParams.get("map"),
    });

    result.then((resolvedValue) => {
      //console.log("Search L182 total Tours", resolvedValue.data.total); // giving first returned tours e.g. 24
      // console.log("Search L183 result of load Tours", resolvedValue);
    });
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
    searchParams,
    setSearchParams
  ]); // end useEffect

  // store city in localstorage
  const writeCityToLocalStorage = (city) => {
    localStorage.setItem("city", city);
  };

  const resetFilterLocalStorage = () => {
    localStorage.removeItem("filterValues");
    localStorage.setItem("filterCount", 0);
  }

  // Filter modal constructed here
  const openFilter = () => {
    showModal("MODAL_COMPONENT", {
      CustomComponent: Filter,
      title: t("filter.filter"),
      page: "main",
      modalSize: "lg",
      doSubmit: handleFilterSubmit,
      resetFilter: handleResetFilter,
      onBack: () => {
        hideModal();
      },
      searchParams,
      setSearchParams,
    });
  };

  //important:
  // state filterValues(from Main) should be set at submission here
  // or be set at at handleResetFilter to null
  // state to be passed then from Main to TourCardContainer
  // in TourCardContainer we pass the filter inside loadTours({ filter: !!filterValues ? filterValues : filter })

  const handleFilterSubmit = ({ filterValues, filterCount }) => {
    
    !!filterCount && console.log("Search L235 filterCount: ", filterCount)
    hideModal();
    handleFilterChange(filterValues); //set searchParams with {'filter' : filterValues} localStorage
    if (filterCount > 0) {
      setCounter(filterCount);
      setActiveFilter(true);
      !!filterValues && setFilterValues(filterValues)
      localStorage.setItem("filterValues", JSON.stringify(filterValues));
      localStorage.setItem("filterCount", filterCount);
      window.location.reload(); 
    } else {
      setActiveFilter(false);
      searchParams.delete("filter");
      localStorage.removeItem("filterValues");
      localStorage.setItem("filterCount", 0);

    }
  };


  const handleResetFilter = () => {
    hideModal();
    handleFilterChange(null);
    setActiveFilter(false); // reset activeFilter state
    setCounter(0);
    setFilterValues(null);  // reset state in parent Main
    resetFilterLocalStorage()
  };

  const handleFilterChange = (entry) => {
    if (entry == null) {
      searchParams.delete("filter");
      localStorage.removeItem("filterValues");
      localStorage.setItem("filterCount", 0);
    } else {
      searchParams.set("filter", JSON.stringify(entry));
      localStorage.setItem("filterValues", JSON.stringify(entry));
    }
    setSearchParams(searchParams);
  };

  // search handling function
  
  const search = async (tempRegion = null) => {
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
      : searchPhrase
      ? searchPhrase
      : "";

    values.map = !!searchParams.get("map") && searchParams.delete('map') ; // remove map param when pressing GO (search button)
    values.provider = searchParams.get("p");
    values.filter = !!searchParams.get("filter") ?  searchParams.get("filter") : null;

    setOrRemoveSearchParam(searchParams, "city", values.city);
    setOrRemoveSearchParam(searchParams, "range", values.range);
    setOrRemoveSearchParam(searchParams, "search", values.search);
    setOrRemoveSearchParam(searchParams, "state", values.state);
    setOrRemoveSearchParam(searchParams, "country", values.country);
    setOrRemoveSearchParam(searchParams, "type", values.type);

    // added for issue #208
    pageKey !== "detail" && setOrRemoveSearchParam(searchParams, "filter", values.filter);
    // if(pageKey === "detail") {
    //   resetFilterLocalStorage();
    // }

    setSearchParams(searchParams);
    
    if (!!goto) { // goto = "/suche"  comes from Start->Header->SearchContainer->Search->search() and from detail page
      navigate(`${goto}?${searchParams.toString()}`);
      // window.location.reload();
    } else { // coming in from Main filter submit  
      await loadTours(values).then((res) => {
        if(pageKey === "detail") {
          navigate(`/suche?${searchParams.toString()}`);
        }
        window.location.reload();
        setScrollToTop(true);
      });
    }
  }; // end search()


  const showCityModal = () => {
    showModal("MODAL_COMPONENT", {
      CustomComponent: FullScreenCityInput,
      searchParams,
      initialCity: cityInput,
      onSelect: async (city) => {
        hideModal();
        if (!!city) {
          setCityInput(city.label);
          setCity(city);
          pageKey==="start" && updateCapCity(city.label);
          // pageKey=="detail" && window.location.reload();

        }
      },
      
      setSearchParams,
      title: "",
      sourceCall: "city",
      page: page,
      srhBoxScrollH: document
        .querySelector(".main-search-bar")
        .getBoundingClientRect().top,
      modalSize: "lg",
      onBack: () => {
        hideModal();
      },
    });
  };
  
  const showSearchModal = () => {
    showModal("MODAL_COMPONENT", {
      CustomComponent: AutosuggestSearchTour,
      onSearchSuggestion: getSearchSuggestion,
      city: city,
      language: language,
      title: "",
      sourceCall: "search",
      page: page,
      srhBoxScrollH: document
        .querySelector(".main-search-bar")
        .getBoundingClientRect().top,
      modalSize: "lg",
    });
  };

    
  const handleGoButton = () =>  {
    search();
    window.location.reload();
    // const newUrl = `${window.location.origin}${window.location.pathname}?${searchParams.toString()}`;
    // window.location.replace(newUrl);
  }
    
 
  const getSearchSuggestion = (autoSuggestion) => {
    if (autoSuggestion === '') {
      searchParams.delete("search");
      setSearchPhrase("");
      setSearchParams(searchParams);
      hideModal();
      return;
    }
    suggestion = autoSuggestion;
    hideModal();
    search();
  };

  return (
    <Fragment>
      <Box
        className="main-search-bar"
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {!cityInput && pageKey ? (
            <TransportTrain
              style={{ strokeWidth: "1px", fill: "#000", stroke: "none" }}
            />
          ) : (
            <SearchIcon
              style={{ strokeWidth: 1, stroke: "#8b8b8b", fill: "#101010" }}
            />
          )}
          <Box
            sx={{
              width: {
                xs: !cityInput && pageKey === "detail" ? "100%" : "200px",
                md: !cityInput && pageKey === "detail" ? "100%" : "486px",
              },
            }}
          >
            <Grid container>
              <Grid
                item
                xs={12}
                md={!cityInput && pageKey === "detail" ? 12 : 6}
                sx={{
                  paddingRight: "16px",
                  padding: 0,
                }}
                onClick={showSearchModal}
              >
                {!cityInput && pageKey === "detail" && (
                  <Box
                    sx={{
                      textAlign: "left",
                      ml: "14px",
                      color: "#101010",
                      fontFamily: "Open Sans",
                      fontSize: { xs: "14px", sm: "15px" },
                      fontWeight: "500",
                      lineHeight: "20px",
                    }}
                  >
                    {t("search.um_reise_berechnen_zu_koenen")}
                  </Box>
                )}
                <Box
                  sx={{
                    paddingLeft: "14px",
                    justifyContent: "flex-start",
                    display: "flex",
                  }}
                >
                    <span className="search-bar--searchPhase">
                      {searchParams.get("search") ? searchParams.get("search") : t("start.suche")}
                    </span>
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
                      sm: 0,
                      md:
                        !cityInput && pageKey === "detail"
                          ? 0
                          : "2px solid #DDDDDD",
                    },
                    paddingLeft: "14px",
                  }}
                >
                  {pageKey !== "detail" ? (
                    <span className="search-bar--city">
                      {cityInput.length > 0
                        ? cityInput
                        : t("start.heimatbahnhof")}
                    </span>
                  ) : !cityInput && pageKey === "detail" ? (
                    <Box
                      className="search-bar--city"
                      sx={{
                        cursor: "pointer",
                        color: "#4992FF !important",
                        fontFamily: "Open Sans",
                        fontSize: { xs: "14px", sm: "15px" },
                        fontWeight: "700",
                        lineHeight: "20px",
                      }}
                    >
                      {t("search.waehle_dein_heimatbahnhof")}
                    </Box>
                  ) : (
                    <Box className="search-bar--city">{cityInput}</Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box>
          {/* ***** filter box in the Main page ******* */}
          <Box>
            {!cityInput && pageKey === "detail" ? (
              ""
            ) : !!initialIsMapView ? null : (
              <Box
                sx={{
                  marginLeft: "10px",
                  backgroundColor: activeFilter && "#FF7663",
                  borderColor: activeFilter && "#FF7663",
                }}
                className="filter-icon-container"
              >
                {!!isMain ? (
                  <IconButton
                    onClick={() => openFilter()}
                  >
                    <FilterIcon
                      sx={{
                        transition: "stroke 0.3s",
                        strokeWidth: 1.25,
                        stroke: activeFilter ? "#fff" : "#101010",
                      }}
                    />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={handleGoButton}
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

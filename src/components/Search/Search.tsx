import * as React from "react";
import { useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { loadTours } from "../../actions/tourActions";
import { compose } from "redux";
import { connect, useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { parseIfNeccessary, setOrRemoveSearchParam } from "../../utils/globals";
import { useNavigate } from "react-router";
import FullScreenCityInput from "./FullScreenCityInput";
import { useTranslation } from "react-i18next";
import FilterIcon from "../../icons/FilterIcon";
import IconButton from "@mui/material/IconButton";
import GoIcon from "../../icons/GoIcon";
import AutosuggestSearch from "./AutosuggestSearch";
import Filter from "../Filter/Filter";
import SearchIcon from "../../icons/SearchIcon";
import TransportTrain from "../../icons/TransportTrain";
import { useMediaQuery } from "@mui/material";
import "/src/config.js";
import { useGetCitiesQuery } from "../../features/apiSlice";
import { theme } from "../../theme";
import { MobileModal } from "./MobileModal";
import { FilterObject } from "../../models/Filter";
import { RootState } from "../..";
import { useAppDispatch } from "../../hooks";
import { cityUpdated } from "../../features/searchSlice";

export interface SearchProps {
  loadTours: any;
  goto: boolean;
  pageKey: string;
  isMain: boolean;
  updateCapCity: (city: string) => void;
  counter: number;
  setCounter: (counter: number) => void;
  setFilterValues: (filterValues: FilterObject) => void;
  filterValues: FilterObject;
  mapBounds: any;
  filterOn: boolean;
  setFilterOn: (filterOn: boolean) => void;
}

export function Search({
  loadTours,
  goto,
  pageKey,
  isMain,
  counter,
  mapBounds,
  filterOn,
  setFilterOn,
}: SearchProps) {
  //navigation
  const navigate = useNavigate();
  // Translation
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useAppDispatch();
  const { data: allCities = [] } = useGetCitiesQuery({});
  const city = useSelector((state: RootState) => state.search.city);

  const filterCountLocal = localStorage.getItem("filterCount")
    ? localStorage.getItem("filterCount")
    : null;

  //initialisation
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchPhrase, setSearchPhrase] = useState("");
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [ShowCitySearch, setShowCitySearch] = useState(false);

  let suggestion: string; //variable that stores the text of the selected option

  const [region, setRegion] = useState(null);
  // const initialIsMapView = (searchParams.has('map') && (searchParams.get('map') === 'true')) || false;
  const [activeFilter, setActiveFilter] = useState(false);
  const [scrollToTop, setScrollToTop] = useState(false);

  const isMasterMarkersSet = useRef(false);

  useEffect(() => {
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [scrollToTop]);

  useEffect(() => {
    const filterParamValue = searchParams.get("filter");
    if (filterParamValue) {
      setActiveFilter(!!counter && counter > 0);
    }
  }, [searchParams, counter]);

  useEffect(() => {
    if (mapBounds) return; // in case of when map changes bounds, this line prevent unnecessary api call at loadTours() below.

    const range = searchParams.get("range");
    const country = searchParams.get("country");
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    let filter = searchParams.get("filter");
    const sort = searchParams.get("sort");
    const provider = searchParams.get("p");

    //setting searchPhrase to the value of the search parameter

    if (search) {
      setSearchPhrase(search); //TODO : do we need to do actual search if search is a city? see line 138 comment

      if (city === null && !search.includes(" ")) {
        // If a search phrase is given and city is empty and the search term consists only of one word,
        // we have to check, if the search term is a valid city_slug.If yes, we will store the search term as city.
        const cityEntry = allCities.find(
          (e) =>
            e.value ===
            search
              .toLowerCase()
              .replace("ü", "ue")
              .replace("ö", "oe")
              .replace("ä", "ae"),
        ); // find the city object in array "allCities"
        if (cityEntry) {
          dispatch(cityUpdated(cityEntry));
          searchParams.set("city", search.toLowerCase());
          setSearchParams(searchParams);
          setSearchPhrase("");
        }
      }
    } else if (country) {
      // country might be useful for future enhancement or new feature related to Klimaticket
      setSearchPhrase(country);
      setRegion({ value: country, label: country, type: "country" });
    } else if (type) {
      // type might be useful for future enhancement or new feature related to Klimaticket
      setSearchPhrase(type);
      setRegion({ value: type, label: type, type: "type" });
    }

    //Remaining code in this useEffect is for Main page only .
    //=======================================================
    if (!isMain) {
      return;
    } else {
      isMasterMarkersSet.current = false;
    }

    const _filter = filter ? parseIfNeccessary(filter) : null; //wenn es einen Filter gibt, soll der Filter richtig formatiert werden: maxAscend: 3000im jJSON format, statt: "maxAscend": 3000
    if (_filter) {
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
    filterCountLocal && setActiveFilter(filterCountLocal > 0);

    const bounds =
      !!searchParams.get("map") &&
      searchParams.get("map") === true &&
      !!mapBounds
        ? mapBounds
        : null;

    // const result = loadTours({
    //   city: city,
    //   range: range,
    //   country: country,
    //   type: type,
    //   search: search,
    //   filter: filterValues ? filterValues : filter, // get this from Filter.js (through Search and Main)
    //   sort: sort,
    //   provider: provider,
    //   map: searchParams.get("map"),
    //   bounds: bounds,
    // });

    // result.then((res) => {
    //   const importedMarkersArray = res?.data?.markers;

    //   if (
    //     !isMasterMarkersSet.current &&
    //     importedMarkersArray &&
    //     importedMarkersArray.length > 0
    //   ) {
    //     localStorage.setItem(
    //       "masterMarkers",
    //       JSON.stringify(importedMarkersArray),
    //     );
    //     isMasterMarkersSet.current = true; // Set the flag to true to avoid future updates
    //   }
    // });
  }, [
    allCities,
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
    setSearchParams,
  ]); // end useEffect

  const openFilter = () => {
    setFilterOn(true);
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
    values.search = suggestion ? suggestion : searchPhrase ? searchPhrase : "";

    // values.map = !!searchParams.get("map") && searchParams.delete('map') ; // remove map param when pressing GO (search button)
    values.map = searchParams.get("map");
    values.provider = searchParams.get("p");
    values.filter = !!searchParams.get("filter")
      ? searchParams.get("filter")
      : null;

    setOrRemoveSearchParam(searchParams, "city", values.city);
    setOrRemoveSearchParam(searchParams, "range", values.range);
    setOrRemoveSearchParam(searchParams, "search", values.search);
    setOrRemoveSearchParam(searchParams, "country", values.country);
    setOrRemoveSearchParam(searchParams, "type", values.type);

    // added for issue #208
    pageKey !== "detail" &&
      setOrRemoveSearchParam(searchParams, "filter", values.filter);
    // if(pageKey === "detail") {
    //   resetFilterLocalStorage();
    // }

    setSearchParams(searchParams);

    if (goto) {
      // goto = "/search"  comes from Start->Header->SearchContainer->Search->search() and from detail page
      navigate(`${goto}?${searchParams.toString()}`);
      // window.location.reload();
    } else {
      // coming in from Main filter submit
      await loadTours(values).then((res) => {
        if (pageKey === "detail") {
          navigate(`/search?${searchParams.toString()}`);
        }
        //if markers received then assign markers array to localStorage('masterMarkers')

        //window.location.reload();
        setScrollToTop(true);
      });
    }
  }; // end search()

  const handleGoButton = () => {
    if (isMain) {
      isMasterMarkersSet.current = false;
    }
    search();
    window.location.reload();
    // const newUrl = `${window.location.origin}${window.location.pathname}?${searchParams.toString()}`;
    // window.location.replace(newUrl);
  };

  const getSearchSuggestion = (autoSuggestion: string) => {
    if (autoSuggestion === "") {
      searchParams.delete("search");
      setSearchPhrase("");
      setSearchParams(searchParams);
      return;
    }
    suggestion = autoSuggestion;
    search();
    window.location.reload();
  };

  return (
    <Fragment>
      <MobileModal
        showMobileModal={showMobileModal}
        setShowMobileModal={setShowMobileModal}
        setShowSearchModal={setShowSearchModal}
        setShowCitySearch={setShowCitySearch}
      />
      <AutosuggestSearch
        showSearchModal={showSearchModal}
        setShowSearchModal={setShowSearchModal}
      />
      <FullScreenCityInput
        showCitySearch={ShowCitySearch}
        setShowCitySearch={setShowCitySearch}
      />
      <Filter showFilter={filterOn} setShowFilter={setFilterOn} />
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
          <SearchIcon
            style={{ strokeWidth: 1, stroke: "#8b8b8b", fill: "#101010" }}
          />
          <Box
            sx={{
              width: {
                xs: !city && pageKey === "detail" ? "100%" : "200px",
                md: !city && pageKey === "detail" ? "100%" : "486px",
              },
            }}
          >
            <Grid container>
              <Grid
                sx={{
                  paddingRight: "16px",
                  padding: 0,
                }}
                onClick={() => {
                  if (isMobile) {
                    setShowMobileModal(true);
                  } else {
                    setShowSearchModal(true);
                  }
                }}
                size={{
                  xs: 12,
                  md: !city && pageKey === "detail" ? 12 : 6,
                }}
              >
                {!city && pageKey === "detail" && (
                  <Box
                    sx={{
                      textAlign: "left",
                      ml: "14px",
                      color: "#101010",
                      fontFamily: `"Open Sans", "Helvetica", "Arial", sans-serif`,
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
                    {searchParams.get("search")
                      ? searchParams.get("search")
                      : t("start.suche")}
                  </span>
                </Box>
              </Grid>
              {/* city -----   modal ----  below */}
              <Grid
                onClick={() => {
                  if (isMobile) {
                    setShowMobileModal(true);
                  } else {
                    setShowCitySearch(true);
                  }
                }}
                display="flex"
                alignItems="center"
                size={{
                  sm: 12,
                  md: !city && pageKey === "detail" ? 12 : 6,
                }}
              >
                <Box
                  sx={{
                    borderLeft: {
                      sm: 0,
                      md:
                        !city && pageKey === "detail" ? 0 : "2px solid #DDDDDD",
                    },
                    paddingLeft: "14px",
                  }}
                >
                  {pageKey !== "detail" ? (
                    <Box
                      className="search-bar--city"
                      sx={{
                        display: "flex",
                        textAlign: "left",
                        alignItems: "center",
                      }}
                    >
                      <>
                        {!isMobile && (
                          <TransportTrain
                            style={{
                              strokeWidth: "1px",
                              fill: "#000",
                              stroke: "none",
                              marginRight: "5px",
                            }}
                          />
                        )}
                        {city?.label
                          ? `${t("search.ab_heimatbahnhof")} ${city?.label}`
                          : t("start.heimatbahnhof")}
                      </>
                    </Box>
                  ) : !city && pageKey === "detail" ? (
                    <Box
                      className="search-bar--city"
                      sx={{
                        cursor: "pointer",
                        color: "#4992FF !important",
                        fontFamily: `"Open Sans", "Helvetica", "Arial", sans-serif`,
                        fontSize: { xs: "14px", sm: "15px" },
                        fontWeight: "700",
                        lineHeight: "20px",
                      }}
                    >
                      {t("search.waehle_dein_heimatbahnhof")}
                    </Box>
                  ) : (
                    <Box className="search-bar--city">{city?.label}</Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box>
          {/* ***** filter box in the Main page ******* */}
          {!city && pageKey === "detail" ? (
            ""
          ) : (
            // ) : !!initialIsMapView ? null : (
            <Box
              sx={{
                marginLeft: "10px",
                backgroundColor: activeFilter && "#FF7663",
                borderColor: activeFilter && "#FF7663",
              }}
              className="filter-icon-container"
            >
              {isMain ? (
                <IconButton onClick={() => openFilter()} aria-label="Filter">
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
                  aria-label="Go"
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
    </Fragment>
  );
}

const mapDispatchToProps = {
  loadTours,
};

const mapStateToProps = (state) => {
  return {
    loading: state.tours.loading,
    filter: state.tours.filter,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Search);

import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TourMapContainer from "../../components/Map/TourMapContainer";
import { Typography } from "@mui/material";
import DomainMenu from "../../components/DomainMenu";
import LanguageMenu from "../../components/LanguageMenu";
import { useTranslation } from "react-i18next";
import ArrowBefore from "../../icons/ArrowBefore";
import MapBtn from "../../components/Search/MapBtn";
import {
  useGetCitiesQuery,
  useLazyGetToursQuery,
} from "../../features/apiSlice";
import { Tour } from "../../models/Tour";
import { RootState } from "../..";
import SearchParamSync from "../../components/SearchParamSync";
import { mapUpdated } from "../../features/searchSlice";
import { useAppDispatch } from "../../hooks";
import TourCardContainer from "../../components/TourCardContainer";
import Search from "../../components/Search/Search";

export default function Main() {
  const filter = useSelector((state: RootState) => state.filter);
  const search = useSelector((state: RootState) => state.search);
  const showMap = useSelector((state: RootState) => state.search.map);
  const provider = useSelector((state: RootState) => state.search.provider);

  const [tours, setTours] = useState<Tour[]>([]);
  const [triggerLoadTours, { data: loadedTours }] = useLazyGetToursQuery();
  const [triggerMoreTours, { data: moreTours, isLoading: isMoreToursLoading }] =
    useLazyGetToursQuery();
  const [filterOn, setFilterOn] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setPageTours(1);
    triggerLoadTours({
      city: search.citySlug || "",
      filter: filter,
      search: search.searchPhrase || "",
      bounds: search.bounds || undefined,
      map: showMap || undefined,
      provider: search.provider || undefined,
      range: search.range || undefined,
      country: search.country || undefined,
      type: search.type || undefined,
      currLanguage: search.language || undefined,
    });
  }, [filter, search]);

  useEffect(() => {
    setTours(loadedTours?.tours || []);
  }, [loadedTours]);

  const [pageTours, setPageTours] = useState(1);

  useEffect(() => {
    if (pageTours > 1) {
      triggerMoreTours({
        city: search.citySlug || "",
        filter: filter,
        search: search.searchPhrase || "",
        bounds: search.bounds || undefined,
        map: showMap || undefined,
        provider: search.provider || undefined,
        range: search.range || undefined,
        country: search.country || undefined,
        type: search.type || undefined,
        page: pageTours,
        currLanguage: search.language || undefined,
      });
    }
  }, [pageTours]);

  useEffect(() => {
    if (moreTours?.tours) {
      setTours([...tours, ...moreTours.tours]);
    }
  }, [moreTours]);

  const { t } = useTranslation();

  const [directLink, setDirectLink] = useState(null);

  const [activeFilter, setActiveFilter] = useState(false);

  const { data: allCities = [] } = useGetCitiesQuery();

  useEffect(() => {
    if (Object.values(filter).length) {
      setActiveFilter(true);
    } else {
      setActiveFilter(false);
    }
  }, [filter]);

  useEffect(() => {
    const _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ pagetitel: "Suche" });
  }, []);

  // TODO: understand what's going on here.
  // useEffect(() => {
  //   if (!!location && location.pathname && allCities && allCities.length > 0) {
  //     const city = checkIfSeoPageCity(location, allCities);
  //     if (!!city && city.value) {
  //       searchParams.set("city", city.value);
  //       setSearchParams(searchParams);
  //       setDirectLink({
  //         header: t(`main.oeffi_bergtouren_fuer_cityname`, {
  //           "city.label": city.label,
  //         }),
  //         description: t(`main.alle_bergtouren_von_cityname`, {
  //           "city.label": city.label,
  //         }),
  //       });
  //     } else if (!city || !city.value) {
  //       setDirectLink(null);
  //     }
  //   }
  // }, [city]);

  const renderCardContainer = () => (
    <Box
      className="cards-container"
      sx={{
        marginTop: {
          xs: marginTopCards,
          md: marginTopCards,
        },
        padding: "25px",
      }}
    >
      <TourCardContainer
        tours={tours}
        hasMore={true}
        isMoreToursLoading={isMoreToursLoading}
        fetchMore={() => setPageTours(pageTours + 1)}
      />
    </Box>
  );

  const marginTopCards = showMap ? "20px" : "140px";

  const totalToursHeader = () => (
    <Box className={"header-line-main"} sx={{ width: "100%" }}>
      <Box
        sx={{
          paddingTop: showMap ? "3.3%" : "10.2%",
          paddingBottom: "5.5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "@media (min-width: 900px)": {
            paddingTop: showMap ? "1.42%" : "2.36%",
            // paddingTop: largeScreenPaddingTop,
          },
        }}
      >
        {loadedTours?.total != undefined && (
          <>
            <Typography
              color={"black"}
              sx={{ textAlign: "center", paddingTop: "0px" }}
            >
              {Number(loadedTours.total).toLocaleString()}
              {loadedTours.total === 1
                ? ` ${t("main.ergebnis")}`
                : ` ${t("main.ergebnisse")}`}
            </Typography>
            {activeFilter && (
              <Box display={"flex"} alignItems={"center"}>
                &nbsp;{" - "}&nbsp;
                <Typography
                  sx={{
                    fontSize: "16px",
                    color: "#FF7663",
                    fontWeight: "600",
                    mr: "2px",
                  }}
                  className={"cursor-link"}
                  onClick={() => setFilterOn(true)}
                >
                  {t("filter.filter")}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <div>
      <SearchParamSync isMain={true} />
      <Box sx={{ width: "100%" }} className={"search-result-header-container"}>
        {!!directLink && (
          <Box className={"seo-bar"}>
            <Typography
              variant={"h1"}
              sx={{ color: "#fff", fontSize: "18px", marginBottom: "5px" }}
            >
              {directLink.header}
            </Typography>
            <Typography variant={"h2"} sx={{ fontSize: "14px", color: "#fff" }}>
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
              xs: "110px",
              md: "110px",
            },
          }}
          position={"relative"}
        >
          <Box component={"div"} className="rowing blueDiv">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ mr: "16px", cursor: "pointer" }}>
                <Link to={"/" + (provider ? `?p=${provider}` : "")}>
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
              <Box className={"colCenter"}>
                <Search
                  pageKey="main"
                  isMain={true}
                  setFilterOn={setFilterOn}
                  filterOn={filterOn}
                />
              </Box>
            </Box>
          )}
        </Box>
        {!showMap && totalToursHeader()}
      </Box>

      {showMap && (
        <Box className={"map-container"}>
          <TourMapContainer markers={loadedTours?.markers || []} />
        </Box>
      )}
      {totalToursHeader()}
      {!!tours && tours.length > 0 && (
        <>
          {renderCardContainer()}
          <MapBtn
            handleClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              dispatch(mapUpdated(!showMap));
            }}
          />
        </>
      )}
    </div>
  );
}

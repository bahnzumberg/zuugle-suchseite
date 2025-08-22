import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import { Fragment, useState } from "react";
import { hasContent } from "../../utils/globals";
import { Link } from "react-router";
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
import { theme } from "../../theme";
import { MobileModal } from "./MobileModal";
import { RootState } from "../..";

export interface SearchProps {
  pageKey: string;
  isMain: boolean;
}

export default function Search({ pageKey, isMain }: SearchProps) {
  // Translation
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [filterOn, setFilterOn] = useState(false);

  const city = useSelector((state: RootState) => state.search.city);
  const searchPhrase = useSelector(
    (state: RootState) => state.search.searchPhrase,
  );

  const [showMobileModal, setShowMobileModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [ShowCitySearch, setShowCitySearch] = useState(false);

  const activeFilter = useSelector((state: RootState) =>
    hasContent(state.filter),
  );

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
      {isMain && <Filter showFilter={filterOn} setShowFilter={setFilterOn} />}
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
                    {searchPhrase ?? t("start.suche")}
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
                <IconButton
                  onClick={() => setFilterOn(true)}
                  aria-label="Filter"
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
                <Link
                  to={{
                    pathname: "/search",
                    search: city?.value ? `?city=${city?.value}` : "",
                  }}
                >
                  <IconButton
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
                </Link>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Fragment>
  );
}

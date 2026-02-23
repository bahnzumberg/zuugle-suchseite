import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import { Fragment, useState } from "react";
import { hasContent } from "../../utils/globals";
import FullScreenCityInput from "./FullScreenCityInput";
import { useTranslation } from "react-i18next";
import AutosuggestSearch from "./AutosuggestSearch";
import Filter from "../Filter/Filter";
import { theme } from "../../theme";
import { MobileModal } from "./MobileModal";
import { RootState } from "../..";
import { CustomIcon } from "../../icons/CustomIcon";
import useMediaQuery from "@mui/material/useMediaQuery";
import SearchActionButton from "./SearchActionButton";

export interface SearchProps {
  pageKey: string;
  isSearchResultsPage: boolean;
  setFilterOn?: (filterOn: boolean) => void;
  filterOn?: boolean;
}

export default function Search({
  pageKey,
  isSearchResultsPage: isSearchResultsPage,
  setFilterOn,
  filterOn,
}: SearchProps) {
  // Translation
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const city = useSelector((state: RootState) => state.search.city);
  const searchPhrase = useSelector(
    (state: RootState) => state.search.searchPhrase,
  );
  const provider = useSelector((state: RootState) => state.search.provider);

  const [showMobileModal, setShowMobileModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [ShowCitySearch, setShowCitySearch] = useState(false);
  if (filterOn === undefined || setFilterOn === undefined) {
    [filterOn, setFilterOn] = useState(false);
  }

  const activeFilter = useSelector(
    (state: RootState) => hasContent(state.filter) || state.search.geolocation,
  );
  const activeFilterCount = useSelector((state: RootState) => {
    const filterCount = Object.keys(state.filter).length;
    return filterCount + (state.search.geolocation ? 1 : 0);
  });

  const handleOpenModal = (type: "search" | "city") => {
    if (isMobile) {
      setShowMobileModal(true);
    } else if (type === "search") {
      setShowSearchModal(true);
    } else {
      setShowCitySearch(true);
    }
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
      {isSearchResultsPage && (
        <Filter showFilter={filterOn} setShowFilter={setFilterOn} />
      )}
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
          <CustomIcon
            name="searchIcon"
            style={{ strokeWidth: 1, stroke: "#8b8b8b", fill: "#101010" }}
          />
          <Box
            sx={{
              width: {
                xs: "160px",
                md: "400px",
              },
            }}
          >
            <Grid container>
              <Grid
                sx={{
                  paddingRight: "16px",
                  padding: 0,
                  cursor: "pointer",
                }}
                role="button"
                tabIndex={0}
                aria-label={t("start.suche")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenModal("search");
                  }
                }}
                onClick={() => handleOpenModal("search")}
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <Box
                  sx={{
                    paddingLeft: "14px",
                    justifyContent: "flex-start",
                    display: "flex",
                  }}
                >
                  <span className="search-bar--searchPhase">
                    {searchPhrase && searchPhrase.length > 0
                      ? searchPhrase
                      : t("start.suche")}
                  </span>
                </Box>
              </Grid>
              {/* city -----   modal ----  below */}
              <Grid
                onClick={() => handleOpenModal("city")}
                role="button"
                tabIndex={0}
                aria-label={
                  city?.label
                    ? `${t("search.ab_heimatbahnhof")} ${city?.label}`
                    : t("start.heimatbahnhof")
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenModal("city");
                  }
                }}
                sx={{ cursor: "pointer" }}
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
                          <CustomIcon
                            name="transportTrain"
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
                        textAlign: "left",
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
        <SearchActionButton
          isSearchResultsPage={isSearchResultsPage}
          pageKey={pageKey}
          city={city}
          searchPhrase={searchPhrase}
          provider={provider}
          activeFilter={activeFilter}
          setFilterOn={setFilterOn}
        />
      </Box>
    </Fragment>
  );
}

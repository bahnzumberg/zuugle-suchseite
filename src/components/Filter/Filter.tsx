import Box from "@mui/material/Box";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import GeneralSlider from "../GeneralSlider";
import Button from "@mui/material/Button";
import { Fragment, useEffect, useMemo, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { theme } from "../../theme";
import dayjs, { Dayjs } from "dayjs";
import { FilterObject, Provider } from "../../models/Filter";
import { useLazyGetFilterQuery } from "../../features/apiSlice";
import { RootState } from "../..";
import { areSetsEqual } from "../../utils/globals";
import { useAppDispatch } from "../../hooks";
import { filterUpdated } from "../../features/filterSlice";
import WarningIcon from "@mui/icons-material/Warning";
import { geolocationUpdated } from "../../features/searchSlice";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import CountryFilter from "./FilterOptions/Country";
import LanguageFilter from "./FilterOptions/Language";
import SportTypeFilter from "./FilterOptions/SportType";
import RangeFilter from "./FilterOptions/Range";
import ProviderFilter from "./FilterOptions/Provider";
import DifficultyFilter from "./FilterOptions/Difficulty";

export interface FilterProps {
  showFilter: boolean;
  setShowFilter: (showFilter: boolean) => void;
}

export default function Filter({ showFilter, setShowFilter }: FilterProps) {
  const dispatch = useAppDispatch();
  const citySlug = useSelector((state: RootState) => state.search.citySlug);
  const search = useSelector((state: RootState) => state.search.searchPhrase);
  const geolocation = useSelector(
    (state: RootState) => state.search.geolocation,
  );
  const [tempGeolocation, setTempGeolocation] = useState<{
    lat?: number | string;
    lng?: number | string;
    radius?: number | string;
  }>({});

  // Handle 3 filter objects:
  // the Filter currently stored in the state,
  const storedFilter = useSelector((state: RootState) => state.filter);
  // the filter options fetched from API,
  const [
    triggerFetchFilter,
    { data: filterData, isFetching: isFilterFetching },
  ] = useLazyGetFilterQuery();
  const { filter: fetchedFilter, providers: fetchedProviders } =
    filterData ?? {};

  const defaultFilterValues = useMemo<FilterObject>(() => {
    return {
      singleDayTour: true,
      multipleDayTour: true,
      summerSeason: true,
      winterSeason: true,
      traverse: false,
      minAscent: fetchedFilter?.minAscent ?? 0,
      maxAscent: fetchedFilter?.maxAscent ?? 3000,
      minDescent: fetchedFilter?.minDescent ?? 0,
      maxDescent: fetchedFilter?.maxDescent ?? 3000,
      minTransportDuration: fetchedFilter?.minTransportDuration ?? 0,
      maxTransportDuration: fetchedFilter?.maxTransportDuration ?? 50,
      minDistance: fetchedFilter?.minDistance ?? 0,
      maxDistance: fetchedFilter?.maxDistance ?? 80,
      ranges: fetchedFilter?.ranges ?? [],
      types: fetchedFilter?.types ?? [],
      languages: fetchedFilter?.languages ?? [],
      difficulties: fetchedFilter?.difficulties ?? [1, 2, 3],
      providers: fetchedFilter?.providers ?? [],
      countries: fetchedFilter?.countries ?? [],
    };
  }, [fetchedFilter]);

  // and a temporary filter object which will become the new stored filter on submit.
  const [tempFilter, setTempFilter] =
    useState<FilterObject>(defaultFilterValues);

  useEffect(() => {
    if (showFilter) {
      triggerFetchFilter({
        city: citySlug || "",
        search: search || "",
      });
    }
  }, [showFilter]);

  // tempFilter has to be updated with fetched and stored filter values
  useEffect(() => {
    if (!isFilterFetching && fetchedFilter) {
      const merged = { ...defaultFilterValues, ...storedFilter };
      setTempFilter(merged);
    }
  }, [fetchedFilter, isFilterFetching, storedFilter]);

  useEffect(() => {
    setTempGeolocation(geolocation ?? {});
  }, [geolocation]);

  function submitFilter() {
    dispatch(filterUpdated(getActiveFilterFields()));
    const lat = parseFloat(tempGeolocation.lat as string);
    const lng = parseFloat(tempGeolocation.lng as string);
    const radius = parseFloat(tempGeolocation.radius as string);

    if (isFinite(lat) && isFinite(lng)) {
      dispatch(
        geolocationUpdated({
          lat,
          lng,
          radius: isFinite(radius) ? radius : 100,
        }),
      );
    } else {
      dispatch(geolocationUpdated(null));
    }
    setShowFilter(false);
  }

  function resetFilter() {
    dispatch(filterUpdated({}));
    dispatch(geolocationUpdated(null));
    setShowFilter(false);
  }

  //TODO: we can derive this state from tempFilter and default filter object
  const [allRangesSelected, setAllRangesSelected] = useState(true);
  const [allCountriesSelected, setAllCountriesSelected] = useState(true);
  const [allTypesSelected, setAllTypesSelected] = useState(true);
  const [allLanguagesSelected, setAllLanguagesSelected] = useState(true);
  const [allDifficultiesSelected, setAllDifficultiesSelected] = useState(true);
  const [allProvidersSelected, setAllProvidersSelected] = useState(true);

  const { t } = useTranslation();

  function getDurationAsHours(dayJsObject: Dayjs | null) {
    if (dayJsObject) {
      return dayJsObject.hour() + dayJsObject.minute() / 60;
    }
  }

  /**
   * Generic function to obtain either value of current tempFilter,
   * or if that is undefined, value of fetchedFilter, or if that is
   * also undefined, some default value.
   */
  function getFilterValue<K extends keyof FilterObject>(
    propertyName: K,
    defaultValue: NonNullable<(typeof tempFilter)[K]>,
  ): NonNullable<(typeof tempFilter)[K]> {
    const value =
      tempFilter[propertyName] ?? fetchedFilter?.[propertyName] ?? defaultValue;
    return (value ?? defaultValue) as NonNullable<(typeof tempFilter)[K]>;
  }

  /**
   *
   * Assemble filter object with only values that differ from default.
   */
  const getActiveFilterFields = () => {
    return Object.entries(defaultFilterValues).reduce(
      (activeFilters, [key, defVal]) => {
        const curVal = tempFilter[key as keyof FilterObject];

        if (Array.isArray(defVal) && Array.isArray(curVal)) {
          // @ts-ignore
          const equalSets = areSetsEqual(new Set(defVal), new Set(curVal));
          if (!equalSets) {
            // @ts-ignore
            activeFilters[key] = curVal;
          }
          return activeFilters;
        }

        if (defVal !== curVal) {
          // @ts-ignore
          activeFilters[key] = curVal;
        }
        return activeFilters;
      },
      {} as FilterObject,
    );
  };

  /**
   * Count the number of fields in tempFilter which are different from default values.
   */
  const countFilterActive = () => {
    const isGeolocationSearchActive = geolocation?.lat && geolocation?.lng;
    return (
      Object.values(getActiveFilterFields()).length +
      (isGeolocationSearchActive ? 1 : 0)
    );
  };

  function displayAsSelected<K extends keyof FilterObject>(
    arrayKey: K,
    value: string | number | Provider,
  ): boolean {
    const array = tempFilter[arrayKey];
    if (!Array.isArray(array)) {
      return true; // default
    }

    // @ts-ignore
    return array.includes(value);
  }

  function updateTempArray<K extends keyof FilterObject>(
    arrayKey: K,
    value: string | number | Provider,
    checked: boolean,
  ) {
    if (!tempFilter[arrayKey]) {
      // initialize tempFilter with all default values
      setTempFilter({
        ...tempFilter,
        [arrayKey]: fetchedFilter?.[arrayKey],
      });
    }

    const currentArray =
      tempFilter[arrayKey] ?? fetchedFilter?.[arrayKey] ?? [];
    const array: string[] | number[] | Provider[] = Array.isArray(currentArray)
      ? currentArray
      : [];

    if (checked) {
      setTempFilter({
        ...tempFilter,
        [arrayKey]: [...array, value],
      });
    } else {
      setTempFilter({
        ...tempFilter,
        [arrayKey]: array.filter((t) => t !== value),
      });
    }
  }

  const updateAllRangeValues = () => {
    if (allRangesSelected) setTempFilter({ ...tempFilter, ranges: [] });
    else setTempFilter({ ...tempFilter, ranges: fetchedFilter?.ranges ?? [] });
    setAllRangesSelected(!allRangesSelected);
  };

  const updateAllCountryValues = () => {
    if (allCountriesSelected) setTempFilter({ ...tempFilter, countries: [] });
    else
      setTempFilter({
        ...tempFilter,
        countries: fetchedFilter?.countries ?? [],
      });
    setAllCountriesSelected(!allCountriesSelected);
  };

  const updateAllTypeValues = () => {
    if (allTypesSelected) setTempFilter({ ...tempFilter, types: [] });
    else setTempFilter({ ...tempFilter, types: fetchedFilter?.types });
    setAllTypesSelected(!allTypesSelected);
  };

  const updateAllLanguageValues = () => {
    if (allLanguagesSelected) setTempFilter({ ...tempFilter, languages: [] });
    else setTempFilter({ ...tempFilter, languages: fetchedFilter?.languages });
    setAllLanguagesSelected(!allLanguagesSelected);
  };

  const updateAllDifficultyValues = () => {
    if (allDifficultiesSelected)
      setTempFilter({ ...tempFilter, difficulties: [] });
    else
      setTempFilter({
        ...tempFilter,
        difficulties: fetchedFilter?.difficulties ?? [0, 1, 2, 3],
      });
    setAllDifficultiesSelected(!allDifficultiesSelected);
  };

  const updateAllProviderValues = () => {
    if (allProvidersSelected) setTempFilter({ ...tempFilter, providers: [] });
    else setTempFilter({ ...tempFilter, providers: fetchedFilter?.providers });
    setAllProvidersSelected(!allProvidersSelected);
  };

  const updateGeolocation = (
    value: string,
    field: "lat" | "lng" | "radius",
  ) => {
    setTempGeolocation({
      ...tempGeolocation,
      [field]: value,
    });
  };

  // Called onBlur of lat/lon inputs
  const handleAutoRadius = () => {
    setTempGeolocation((prev) => {
      const lat = parseFloat(prev.lat as string);
      const lng = parseFloat(prev.lng as string);
      const radius = parseFloat(prev.radius as string);

      if (isFinite(lat) && isFinite(lng) && !isFinite(radius)) {
        return { ...prev, radius: "100" };
      }
      return prev;
    });
  };

  const style = {
    borderRadius: "18px",
  };

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open={showFilter}
      onClose={() => setShowFilter(false)}
      fullScreen={fullScreen}
      sx={{ "& .MuiDialog-paper": style }}
      className={"my-modal"}
    >
      <DialogTitle>
        <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
          {t("filter.filter")}
        </Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => setShowFilter(false)}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Box style={{ maxHeight: "600px" }}>
          {isFilterFetching ? (
            <Box
              style={{
                maxWidth: "100%",
                textAlign: "center",
                padding: "20px",
                width: "500px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Fragment>
              <Box className={"filter-box border"}>
                <Typography variant={"subtitle1"}>
                  {t("filter.tourlaenge")}
                </Typography>
                <Grid container>
                  <Grid
                    sx={{
                      borderRight: "1px solid #EAEAEA",
                      paddingRight: "16px",
                    }}
                    size={6}
                  >
                    <Grid container spacing={0}>
                      <Grid sx={{ alignSelf: "center" }} size={6}>
                        <Typography>{t("filter.tagestour")}</Typography>
                      </Grid>
                      <Grid sx={{ textAlign: "right" }} size={6}>
                        <Switch
                          checked={tempFilter.singleDayTour ?? true}
                          onChange={(e) =>
                            setTempFilter({
                              ...tempFilter,
                              singleDayTour: e.target.checked,
                            })
                          }
                          disabled={!fetchedFilter?.isSingleDayTourPossible}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid sx={{ paddingLeft: "16px" }} size={6}>
                    <Grid container spacing={0}>
                      <Grid sx={{ alignSelf: "center" }} size={6}>
                        <Typography>{t("filter.mehrtagestour")}</Typography>
                      </Grid>
                      <Grid sx={{ textAlign: "right" }} size={6}>
                        <Switch
                          checked={tempFilter.multipleDayTour ?? true}
                          onChange={(e) =>
                            setTempFilter({
                              ...tempFilter,
                              multipleDayTour: e.target.checked,
                            })
                          }
                          disabled={!fetchedFilter?.isMultipleDayTourPossible}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
              <Box
                className={"filter-box border"}
                style={{ paddingTop: "20px", paddingBottom: "20px" }}
              >
                <Typography variant={"subtitle1"}>
                  {t("filter.jahreszeit")}
                </Typography>
                <Grid container>
                  <Grid
                    sx={{
                      borderRight: "1px solid #EAEAEA",
                      paddingRight: "16px",
                    }}
                    size={6}
                  >
                    <Grid container spacing={0}>
                      <Grid sx={{ alignSelf: "center" }} size={6}>
                        <Typography>{t("filter.sommertour")}</Typography>
                      </Grid>
                      <Grid sx={{ textAlign: "right" }} size={6}>
                        <Switch
                          checked={tempFilter.summerSeason ?? true}
                          onChange={(e) =>
                            setTempFilter({
                              ...tempFilter,
                              summerSeason: e.target.checked,
                            })
                          }
                          disabled={!fetchedFilter?.isSummerTourPossible}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid sx={{ paddingLeft: "16px" }} size={6}>
                    <Grid container spacing={0}>
                      <Grid sx={{ alignSelf: "center" }} size={6}>
                        <Typography>{t("filter.wintertour")}</Typography>
                      </Grid>
                      <Grid sx={{ textAlign: "right" }} size={6}>
                        <Switch
                          checked={tempFilter.winterSeason ?? true}
                          onChange={(e) =>
                            setTempFilter({
                              ...tempFilter,
                              winterSeason: e.target.checked,
                            })
                          }
                          disabled={!fetchedFilter?.isWinterTourPossible}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
              <Box className={"filter-box border"}>
                <Grid container sx={{ paddingTop: "16px" }}>
                  <Grid size={10}>
                    <Typography variant={"subtitle1"}>
                      {t("filter.nur_ueberschreitungen")}
                    </Typography>
                    <Typography
                      variant={"subtitle2"}
                      sx={{ fontSize: "16px", fontWeight: 400 }}
                    >
                      {t("filter.tourstart_ende_andere_stops")}
                    </Typography>
                  </Grid>
                  <Grid sx={{ textAlign: "right" }} size={2}>
                    <Switch
                      checked={tempFilter.traverse ?? false}
                      onChange={(e) =>
                        setTempFilter({
                          ...tempFilter,
                          traverse: e.target.checked,
                        })
                      }
                      disabled={!fetchedFilter?.isTraversePossible}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box className={"filter-box border"} sx={{ paddingTop: "20px" }}>
                <Grid container>
                  <Grid
                    sx={{
                      borderRight: { xs: "none", sm: "1px solid #EAEAEA" },
                      paddingRight: { xs: 0, sm: "16px" },
                    }}
                    size={{ xs: 12, sm: 6 }}
                  >
                    <Typography>
                      {t("filter.anstieg")} ({t("details.hm_hoehenmeter")})
                    </Typography>
                    <GeneralSlider
                      step={100}
                      min={fetchedFilter?.minAscent ?? 0}
                      max={fetchedFilter?.maxAscent ?? 3000}
                      value={[
                        getFilterValue("minAscent", 0),
                        getFilterValue("maxAscent", 3000),
                      ]}
                      onChange={(e, value) => {
                        if (Array.isArray(value)) {
                          setTempFilter({
                            ...tempFilter,
                            minAscent: value[0],
                            maxAscent: value[1],
                          });
                        }
                      }}
                    />

                    <Box sx={{ marginTop: "15px" }}>
                      <Grid container spacing={"10px"}>
                        <Grid size={6}>
                          <TextField
                            type="number"
                            label={t("filter.minimum")}
                            variant="outlined"
                            value={getFilterValue("minAscent", 0)}
                            onChange={(e) => {
                              setTempFilter({
                                ...tempFilter,
                                minAscent: +e.target.value,
                              });
                            }}
                          />
                        </Grid>
                        <Grid size={6}>
                          <TextField
                            type="number"
                            label={t("filter.maximum")}
                            variant="outlined"
                            value={getFilterValue("maxAscent", 3000)}
                            onChange={(e) => {
                              setTempFilter({
                                ...tempFilter,
                                maxAscent: +e.target.value,
                              });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                    {getFilterValue("maxAscent", 3000) >= 3000 && (
                      <div
                        style={{
                          fontSize: "12px",
                          width: "100%",
                          textAlign: "right",
                          paddingTop: "5px",
                          color: "#8B8B8B",
                        }}
                      >
                        3000+ {t("filter.hoehenmeter")}
                      </div>
                    )}
                  </Grid>
                  <Grid
                    sx={{ paddingLeft: { xs: 0, sm: "16px" } }}
                    size={{ xs: 12, sm: 6 }}
                  >
                    <Typography>
                      {t("main.abstieg")} ({t("details.hm_hoehenmeter")})
                    </Typography>
                    <GeneralSlider
                      step={100}
                      min={fetchedFilter?.minDescent ?? 0}
                      max={fetchedFilter?.maxDescent ?? 3000}
                      value={[
                        getFilterValue("minDescent", 0),
                        getFilterValue("maxDescent", 3000),
                      ]}
                      onChange={(e, value) => {
                        if (Array.isArray(value)) {
                          setTempFilter({
                            ...tempFilter,
                            minDescent: value[0],
                            maxDescent: value[1],
                          });
                        }
                      }}
                    />
                    <Box sx={{ marginTop: "15px" }}>
                      <Grid container spacing={"10px"}>
                        <Grid size={6}>
                          <TextField
                            type="number"
                            label={t("filter.minimum")}
                            variant="outlined"
                            value={getFilterValue("minDescent", 0)}
                            onChange={(e) => {
                              setTempFilter({
                                ...tempFilter,
                                minDescent: +e.target.value,
                              });
                            }}
                          />
                        </Grid>
                        <Grid size={6}>
                          <TextField
                            type="number"
                            label={t("filter.maximum")}
                            variant="outlined"
                            value={getFilterValue("maxDescent", 3000)}
                            onChange={(e) => {
                              setTempFilter({
                                ...tempFilter,
                                maxDescent: +e.target.value,
                              });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                    {getFilterValue("maxDescent", 3000) >= 3000 && (
                      <div
                        style={{
                          fontSize: "12px",
                          width: "100%",
                          textAlign: "right",
                          paddingTop: "5px",
                          color: "#8B8B8B",
                        }}
                      >
                        3000+ {t("filter.hoehenmeter")}{" "}
                      </div>
                    )}
                  </Grid>
                </Grid>
              </Box>
              <Box className={"filter-box border"} sx={{ paddingTop: "20px" }}>
                <Grid container>
                  <Grid
                    sx={{
                      borderRight: { xs: "none", sm: "1px solid #EAEAEA" },
                      paddingRight: { xs: 0, sm: "16px" },
                    }}
                    size={{ xs: 12, sm: 6 }}
                  >
                    <Typography>
                      {t("main.anfahrtszeit")} ({t("details.h_hour")})
                    </Typography>
                    <GeneralSlider
                      step={0.5}
                      min={fetchedFilter?.minTransportDuration ?? 0}
                      max={fetchedFilter?.maxTransportDuration ?? 50}
                      value={[
                        getFilterValue("minTransportDuration", 0),
                        getFilterValue("maxTransportDuration", 50),
                      ]}
                      onChange={(e, value) => {
                        if (Array.isArray(value)) {
                          setTempFilter({
                            ...tempFilter,
                            minTransportDuration: value[0],
                            maxTransportDuration: value[1],
                          });
                        }
                      }}
                    />

                    <Box sx={{ marginTop: "15px" }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid container spacing={"10px"}>
                          <Grid size={6}>
                            <TimeField
                              label={t("filter.minimum")}
                              variant="outlined"
                              value={dayjs()
                                .startOf("day")
                                .add(
                                  getFilterValue("minTransportDuration", 0),
                                  "hours",
                                )}
                              format="HH:mm"
                              onChange={(value) =>
                                setTempFilter({
                                  ...tempFilter,
                                  minTransportDuration:
                                    getDurationAsHours(value),
                                })
                              }
                            />
                          </Grid>
                          <Grid size={6}>
                            <TimeField
                              label={t("filter.maximum")}
                              variant="outlined"
                              value={dayjs()
                                .startOf("day")
                                .add(
                                  getFilterValue("maxTransportDuration", 50),
                                  "hours",
                                )}
                              format="HH:mm"
                              onChange={(value) =>
                                setTempFilter({
                                  ...tempFilter,
                                  maxTransportDuration:
                                    getDurationAsHours(value),
                                })
                              }
                            />
                          </Grid>
                        </Grid>
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{ paddingLeft: { xs: 0, sm: "16px" } }}
                    size={{ xs: 12, sm: 6 }}
                  >
                    <Typography>
                      {t("filter.gehdistanz")} ({t("details.km_kilometer")})
                    </Typography>
                    <GeneralSlider
                      step={2}
                      min={fetchedFilter?.minDistance ?? 0}
                      max={fetchedFilter?.maxDistance ?? 80}
                      value={[
                        getFilterValue("minDistance", 0),
                        getFilterValue("maxDistance", 80),
                      ]}
                      onChange={(e, value) => {
                        if (Array.isArray(value)) {
                          setTempFilter({
                            ...tempFilter,
                            minDistance: value[0],
                            maxDistance: value[1],
                          });
                        }
                      }}
                    />
                    <Box sx={{ marginTop: "15px" }}>
                      <Grid container spacing={"10px"}>
                        <Grid size={6}>
                          <TextField
                            type="number"
                            label={t("filter.minimum")}
                            variant="outlined"
                            value={getFilterValue("minDistance", 0)}
                            onChange={(e) =>
                              setTempFilter({
                                ...tempFilter,
                                minDistance: +e.target.value,
                              })
                            }
                          />
                        </Grid>
                        <Grid size={6}>
                          <TextField
                            type="number"
                            label={t("filter.maximum")}
                            variant="outlined"
                            value={getFilterValue("maxDistance", 80)}
                            onChange={(e) =>
                              setTempFilter({
                                ...tempFilter,
                                maxDistance: +e.target.value,
                              })
                            }
                          />
                          {getFilterValue("maxDistance", 80) >= 80 && (
                            <div
                              style={{
                                fontSize: "12px",
                                width: "100%",
                                textAlign: "left",
                                paddingTop: "5px",
                                color: "#8B8B8B",
                              }}
                            >
                              80+ {t("details.km_kilometer")}
                            </div>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <SportTypeFilter
                onToggleAll={updateAllTypeValues}
                isChecked={(value) => displayAsSelected("types", value)}
                onChange={({ value, checked }) =>
                  updateTempArray("types", value, checked)
                }
                values={fetchedFilter?.types ?? []}
              />
              <DifficultyFilter
                onToggleAll={updateAllDifficultyValues}
                isChecked={(value) => displayAsSelected("difficulties", value)}
                onChange={({ value, checked }) =>
                  updateTempArray("difficulties", value, checked)
                }
                values={fetchedFilter?.difficulties ?? [1, 2, 3]}
              />
              <LanguageFilter
                onToggleAll={updateAllLanguageValues}
                isChecked={(value) => displayAsSelected("languages", value)}
                onChange={({ value, checked }) =>
                  updateTempArray("languages", value, checked)
                }
                values={fetchedFilter?.languages ?? []}
              />
              <RangeFilter
                onToggleAll={updateAllRangeValues}
                isChecked={(value) => displayAsSelected("ranges", value)}
                onChange={({ value, checked }) =>
                  updateTempArray("ranges", value, checked)
                }
                values={fetchedFilter?.ranges ?? []}
              />
              <CountryFilter
                onToggleAll={updateAllCountryValues}
                isChecked={(value) => displayAsSelected("countries", value)}
                onChange={({ value, checked }) =>
                  updateTempArray("countries", value, checked)
                }
                values={fetchedFilter?.countries ?? []}
              />
              <Box className="filter-box border" sx={{ p: 2, pt: 3 }}>
                <Grid container alignItems="center" spacing={1}>
                  <Typography variant={"subtitle1"}>
                    {t("filter.geolocation_search")}
                  </Typography>{" "}
                  {!!tempGeolocation?.lat !== !!tempGeolocation?.lng && (
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <WarningIcon color="error" fontSize="small" />
                      <Typography sx={{ color: "error.main" }}>
                        {" " + t("filter.geolocation_search_warning") + " "}
                      </Typography>
                    </Box>
                  )}
                </Grid>
                <Grid container spacing={"10px"} sx={{ marginTop: "15px" }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="lat"
                      fullWidth
                      value={tempGeolocation?.lat ?? ""}
                      onChange={(e) => updateGeolocation(e.target.value, "lat")}
                      onBlur={handleAutoRadius}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="lon"
                      fullWidth
                      value={tempGeolocation?.lng ?? ""}
                      onChange={(e) => updateGeolocation(e.target.value, "lng")}
                      onBlur={handleAutoRadius}
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Radius (m)"
                      fullWidth
                      value={tempGeolocation?.radius ?? ""}
                      onChange={(e) =>
                        updateGeolocation(e.target.value, "radius")
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
              <ProviderFilter
                onToggleAll={updateAllProviderValues}
                isChecked={(value) => displayAsSelected("providers", value)}
                onChange={({ value, checked }) =>
                  updateTempArray("providers", value, checked)
                }
                values={fetchedFilter?.providers ?? []}
                fetchedProviders={fetchedProviders ?? []}
              />
            </Fragment>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ py: 2 }}>
        <Button
          variant={"text"}
          sx={{ marginRight: 1, color: "#8B8B8B" }}
          onClick={resetFilter}
        >
          {" "}
          {t("filter.filter_loeschen")}
        </Button>
        <Button variant={"contained"} onClick={submitFilter}>
          {countFilterActive() === 0 ? "" : countFilterActive()}{" "}
          {t("filter.filter_anwenden")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

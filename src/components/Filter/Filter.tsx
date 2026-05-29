import Box from "@mui/material/Box";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { theme } from "../../theme";
import { FilterObject, Provider } from "../../models/Filter";
import { useLazyGetFilterQuery } from "../../features/apiSlice";
import { RootState } from "../..";
import { useAppDispatch } from "../../hooks";
import { filterUpdated } from "../../features/filterSlice";
import {
  cityUpdated,
  CityObject,
  geolocationUpdated,
} from "../../features/searchSlice";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import CheckboxFilterSection from "./FilterOptions/CheckboxFilterSection";
import DifficultyFilter from "./FilterOptions/Difficulty";
import TourLengthFilter from "./FilterOptions/TourLength";
import SeasonFilter from "./FilterOptions/Season";
import TraverseFilter from "./FilterOptions/Traverse";
import AscentFilter from "./FilterOptions/Ascent";
import TravelTimeFilter from "./FilterOptions/TravelTime";
import GeolocationSearchFilter from "./FilterOptions/GeolocationSearch";
import CityFilter from "./FilterOptions/CityFilter";
import LoadingView from "./LoadingView";
import {
  countFilterActive,
  getActiveFilterFields,
  getDefaultFilterValues,
  getSportTypeTranslationMap,
  getLanguageTranslationMap,
  getCountryTranslationMap,
  getTransformedFilterOptions,
} from "./utils";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export interface FilterProps {
  showFilter: boolean;
  setShowFilter: (showFilter: boolean) => void;
}

export default function Filter({ showFilter, setShowFilter }: FilterProps) {
  const dispatch = useAppDispatch();
  const city = useSelector((state: RootState) => state.search.city);
  const citySlug = useSelector((state: RootState) => state.search.citySlug);
  const search = useSelector((state: RootState) => state.search.searchWithType);
  const geolocation = useSelector(
    (state: RootState) => state.search.geolocation,
  );
  const [tempGeolocation, setTempGeolocation] = useState<{
    lat?: number | string;
    lng?: number | string;
    radius?: number | string;
  }>({});
  const [tempCity, setTempCity] = useState<CityObject | null>(null);

  // Prevents the debounced re-fetch from firing after a server response updates tempFilter
  const isServerUpdate = useRef(false);
  const hasInitialized = useRef(false);

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

  const defaultFilterValues = getDefaultFilterValues();

  // and a temporary filter object which will become the new stored filter on submit.
  const [tempFilter, setTempFilter] =
    useState<FilterObject>(defaultFilterValues);

  function fetchFilterScalar(filter: FilterObject) {
    const scalarFilter = {
      ...filter,
      ranges: undefined,
      types: undefined,
      languages: undefined,
      difficulties: undefined,
      providers: undefined,
      countries: undefined,
    };
    triggerFetchFilter({
      city: citySlug || "",
      search: search?.term || "",
      search_type: search?.type !== "term" ? search?.type : "",
      filter: scalarFilter,
    });
  }

  useEffect(() => {
    if (showFilter) {
      fetchFilterScalar(storedFilter);
    } else {
      hasInitialized.current = false;
    }
  }, [showFilter]);

  // tempFilter has to be updated with fetched and stored filter values
  useEffect(() => {
    if (!isFilterFetching && fetchedFilter) {
      isServerUpdate.current = true;
      if (!hasInitialized.current) {
        // First load: pre-populate from stored filter and capture bounds snapshot
        hasInitialized.current = true;
        setTempFilter({ ...defaultFilterValues, ...storedFilter });
      } else {
        // Subsequent re-fetches: preserve user's in-progress selections, only update bounds/defaults
        setTempFilter((prev) => ({ ...defaultFilterValues, ...prev }));
      }
    }
  }, [fetchedFilter, isFilterFetching, storedFilter]);

  // Re-fetch narrowed filter options when user changes selections (debounced)
  useEffect(() => {
    if (!showFilter) return;
    if (isServerUpdate.current) {
      isServerUpdate.current = false;
      return;
    }
    const timer = setTimeout(() => {
      fetchFilterScalar(tempFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [tempFilter]);

  useEffect(() => {
    setTempGeolocation(geolocation ?? {});
  }, [geolocation]);

  useEffect(() => {
    setTempCity(city);
  }, [city]);

  function submitFilter() {
    dispatch(
      filterUpdated(getActiveFilterFields({ defaultFilterValues, tempFilter })),
    );
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
    dispatch(cityUpdated(tempCity));
    setShowFilter(false);
  }

  function resetFilter() {
    dispatch(filterUpdated({}));
    dispatch(geolocationUpdated(null));
    setShowFilter(false);
  }

  const { t } = useTranslation();

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

  function displayAsSelected<K extends keyof FilterObject>(
    arrayKey: K,
    value: string | number | Provider,
  ): boolean {
    const array = tempFilter[arrayKey];
    if (!Array.isArray(array)) {
      return false; // default: nothing checked
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
          {isFilterFetching && !fetchedFilter ? (
            <LoadingView />
          ) : (
            <Fragment>
              <CityFilter tempCity={tempCity} setTempCity={setTempCity} />
              <TraverseFilter
                tempFilter={tempFilter}
                setTempFilter={setTempFilter}
                fetchedFilter={fetchedFilter}
              />
              <AscentFilter
                tempFilter={tempFilter}
                setTempFilter={setTempFilter}
                getFilterValue={getFilterValue}
              />
              <TravelTimeFilter
                tempFilter={tempFilter}
                setTempFilter={setTempFilter}
                getFilterValue={getFilterValue}
              />
              <DifficultyFilter
                isChecked={(value) => displayAsSelected("difficulties", value)}
                onChange={({ value, checked }) =>
                  updateTempArray("difficulties", value, checked)
                }
                values={fetchedFilter?.difficulties ?? [1, 2, 3]}
              />
              <Grid container spacing={0} className="filter-box border">
                <Grid size={6} sx={{ borderRight: "1px solid #EAEAEA", pr: 2 }}>
                  <TourLengthFilter
                    tempFilter={tempFilter}
                    setTempFilter={setTempFilter}
                    fetchedFilter={fetchedFilter}
                  />
                </Grid>
                <Grid size={6} sx={{ pl: 2 }}>
                  <SeasonFilter
                    tempFilter={tempFilter}
                    setTempFilter={setTempFilter}
                    fetchedFilter={fetchedFilter}
                  />
                </Grid>
              </Grid>
              <CheckboxFilterSection
                title={t("main.sportart")}
                options={getTransformedFilterOptions({
                  list: fetchedFilter?.types ?? [],
                  translationMap: getSportTypeTranslationMap(t),
                })}
                isChecked={(value) => displayAsSelected("types", value)}
                onChange={({ value, checked }) =>
                  updateTempArray("types", value, checked)
                }
              />
              <CheckboxFilterSection
                title={t("filter.sprache")}
                options={getTransformedFilterOptions({
                  list: fetchedFilter?.languages ?? [],
                  translationMap: getLanguageTranslationMap(t),
                }).filter((l) => !!l.value && !!l.label)}
                isChecked={(value) => displayAsSelected("languages", value)}
                onChange={({ value, checked }) =>
                  updateTempArray("languages", value, checked)
                }
              />
              <CheckboxFilterSection
                title={t("filter.regionen")}
                options={(fetchedFilter?.ranges ?? []).map((v) => ({
                  value: v,
                  label: v,
                }))}
                isChecked={(value) => displayAsSelected("ranges", value)}
                onChange={({ value, checked }) =>
                  updateTempArray("ranges", value, checked)
                }
              />
              <CheckboxFilterSection
                title={t("filter.countries")}
                options={getTransformedFilterOptions({
                  list: fetchedFilter?.countries ?? [],
                  translationMap: getCountryTranslationMap(t),
                })}
                isChecked={(value) => displayAsSelected("countries", value)}
                onChange={({ value, checked }) =>
                  updateTempArray("countries", value, checked)
                }
              />
              <CheckboxFilterSection
                title={t("filter.provider")}
                options={(fetchedFilter?.providers ?? []).map((v) => ({
                  value: v,
                  label:
                    fetchedProviders?.find((p) => p.provider === v)
                      ?.provider_name ?? "",
                }))}
                isChecked={(value) => displayAsSelected("providers", value)}
                onChange={({ value, checked }) =>
                  updateTempArray("providers", value, checked)
                }
              />
              <GeolocationSearchFilter
                tempGeolocation={tempGeolocation}
                updateGeolocation={updateGeolocation}
                handleAutoRadius={handleAutoRadius}
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
          {countFilterActive({
            geolocation,
            defaultFilterValues,
            tempFilter,
          }) || ""}{" "}
          {t("filter.filter_anwenden")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

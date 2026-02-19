import Box from "@mui/material/Box";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { theme } from "../../theme";
import { FilterObject, Provider } from "../../models/Filter";
import { useLazyGetFilterQuery } from "../../features/apiSlice";
import { RootState } from "../..";
import { useAppDispatch } from "../../hooks";
import { filterUpdated } from "../../features/filterSlice";
import { geolocationUpdated } from "../../features/searchSlice";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import DialogContent from "@mui/material/DialogContent";
import CountryFilter from "./FilterOptions/Country";
import LanguageFilter from "./FilterOptions/Language";
import SportTypeFilter from "./FilterOptions/SportType";
import RangeFilter from "./FilterOptions/Range";
import ProviderFilter from "./FilterOptions/Provider";
import DifficultyFilter from "./FilterOptions/Difficulty";
import TourLengthFilter from "./FilterOptions/TourLength";
import SeasonFilter from "./FilterOptions/Season";
import TraverseFilter from "./FilterOptions/Traverse";
import AscentFilter from "./FilterOptions/Ascent";
import TravelTimeFilter from "./FilterOptions/TravelTime";
import GeolocationSearchFilter from "./FilterOptions/GeolocationSearch";
import LoadView from "./FilterOptions/LoadView";
import FilterFooter from "./FilterFooter";
import CloseButton from "./CloseButton";
import { CheckboxOptionsFilterKey } from "./types";
import { getDefaultFilterValues } from "./constants";
import { countFilterActive, getActiveFilterFields } from "./utils";

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

  const defaultFilterValues = getDefaultFilterValues(fetchedFilter);

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
    setShowFilter(false);
  }

  function resetFilter() {
    dispatch(filterUpdated({}));
    dispatch(geolocationUpdated(null));
    setShowFilter(false);
  }

  //TODO: we can derive this state from tempFilter and default filter object
  const [selectAllToggle, setSelectAllToggle] = useState<
    Record<CheckboxOptionsFilterKey, boolean>
  >({
    ranges: true,
    countries: true,
    types: true,
    languages: true,
    difficulties: true,
    providers: true,
  });

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

  const onToggleAll = (
    keyToUpdate: CheckboxOptionsFilterKey,
    fallbackValue: Array<string | number> = [],
  ) => {
    //TODO: make this simple
    let newValue = fetchedFilter?.[keyToUpdate] ?? fallbackValue;

    if (selectAllToggle[keyToUpdate]) {
      newValue = [];
    }

    setTempFilter({
      ...tempFilter,
      [keyToUpdate]: newValue,
    });

    setSelectAllToggle((prev) => ({
      ...prev,
      [keyToUpdate]: !prev[keyToUpdate],
    }));
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
      <CloseButton onClose={() => setShowFilter(false)} />
      <DialogContent dividers>
        <Box style={{ maxHeight: "600px" }}>
          {isFilterFetching ? (
            <LoadView />
          ) : (
            <Fragment>
              <TourLengthFilter
                tempFilter={tempFilter}
                setTempFilter={setTempFilter}
                fetchedFilter={fetchedFilter}
              />
              <SeasonFilter
                tempFilter={tempFilter}
                setTempFilter={setTempFilter}
                fetchedFilter={fetchedFilter}
              />
              <TraverseFilter
                tempFilter={tempFilter}
                setTempFilter={setTempFilter}
                fetchedFilter={fetchedFilter}
              />
              <AscentFilter
                tempFilter={tempFilter}
                setTempFilter={setTempFilter}
                fetchedFilter={fetchedFilter}
                getFilterValue={getFilterValue}
              />
              <TravelTimeFilter
                tempFilter={tempFilter}
                setTempFilter={setTempFilter}
                fetchedFilter={fetchedFilter}
                getFilterValue={getFilterValue}
              />
              <SportTypeFilter
                onToggleAll={() => onToggleAll("types")}
                isChecked={(value) => displayAsSelected("types", value)}
                onChange={({ value, checked }) =>
                  updateTempArray("types", value, checked)
                }
                values={fetchedFilter?.types ?? []}
              />
              <DifficultyFilter
                onToggleAll={() => onToggleAll("difficulties", [0, 1, 2, 3])}
                isChecked={(value) => displayAsSelected("difficulties", value)}
                onChange={({ value, checked }) =>
                  updateTempArray("difficulties", value, checked)
                }
                values={fetchedFilter?.difficulties ?? [1, 2, 3]}
              />
              <LanguageFilter
                onToggleAll={() => onToggleAll("languages")}
                isChecked={(value) => displayAsSelected("languages", value)}
                onChange={({ value, checked }) =>
                  updateTempArray("languages", value, checked)
                }
                values={fetchedFilter?.languages ?? []}
              />
              <RangeFilter
                onToggleAll={() => onToggleAll("ranges")}
                isChecked={(value) => displayAsSelected("ranges", value)}
                onChange={({ value, checked }) =>
                  updateTempArray("ranges", value, checked)
                }
                values={fetchedFilter?.ranges ?? []}
              />
              <CountryFilter
                onToggleAll={() => onToggleAll("countries")}
                isChecked={(value) => displayAsSelected("countries", value)}
                onChange={({ value, checked }) =>
                  updateTempArray("countries", value, checked)
                }
                values={fetchedFilter?.countries ?? []}
              />
              <GeolocationSearchFilter
                tempGeolocation={tempGeolocation}
                updateGeolocation={updateGeolocation}
                handleAutoRadius={handleAutoRadius}
              />
              <ProviderFilter
                onToggleAll={() => onToggleAll("providers")}
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
      <FilterFooter
        resetFilter={resetFilter}
        submitFilter={submitFilter}
        activeFilterCount={countFilterActive({
          geolocation,
          defaultFilterValues,
          tempFilter,
        })}
      />
    </Dialog>
  );
}

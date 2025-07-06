import * as React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import DifficultySlider from "../DifficultySlider";
import GeneralSlider from "../GeneralSlider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Intensity from "../../icons/Intensity";
import NumberInput from "../NumberInput";
import Button from "@mui/material/Button";
import { Fragment, useEffect, useState } from "react";
import TextWithIcon from "../TextWithIcon";
import { convertNumToTime, getFilterProp } from "../../utils/globals";
import CircularProgress from "@mui/material/CircularProgress";
import { loadFilter } from "../../actions/tourActions";
import { compose } from "redux";
import { connect } from "react-redux";
import TextInput from "../TextInput";
import { useTranslation } from "react-i18next";

function Filter({
  filter,
  doSubmit,
  resetFilter,
  searchParams,
  loadFilter,
  isLoadingFilter,
  visibleToursGPXSouthWest,
  visibleToursGPXNorthEast,
}) {
  const [singleDayTour, setSingleDayTour] = useState(true);
  const [multipleDayTour, setMultipleDayTour] = useState(true);
  const [summerSeason, setSummerSeason] = useState(true);
  const [winterSeason, setWinterSeason] = useState(true);
  const [difficulty, setDifficulty] = useState(10);
  const [minAscent, setMinAscent] = useState(0);
  const [maxAscent, setMaxAscent] = useState(10000);
  const [minDescent, setMinDescent] = useState(0);
  const [maxDescent, setMaxDescent] = useState(10000);

  const [minTransportDuration, setMinTransportDuration] = useState(0);
  const [maxTransportDuration, setMaxTransportDuration] = useState(10000);

  const [minDistance, setMinDistance] = useState(0);
  const [maxDistance, setMaxDistance] = useState(10000);
  const [traverse, setTravers] = useState(false);

  const [rangeValues, setRangeValues] = useState([]);
  const [typeValues, setTypeValues] = useState([]);
  const [languageValues, setLanguageValues] = useState([]);

  const [rangeValuesState, setRangeValuesState] = useState(true);
  const [typeValuesState, setTypeValuesState] = useState(true);
  const [languageValuesState, setLanguageValuesState] = useState(true);
  const [coordinatesSouthWest, setCoordinatesSouthWest] = useState([]);
  const [coordinatesNorthEast, setCoordinatesNorthEast] = useState([]);

  // Translation-related
  const { t } = useTranslation();

  // set translation variables
  const tourlaenge_label = t("filter.tourlaenge");
  const tagestour_label = t("filter.tagestour");
  const mehrtagestour_label = t("filter.mehrtagestour");
  const jahreszeit_label = t("filter.jahreszeit");
  const sommertour_label = t("filter.sommertour");
  const wintertour_label = t("filter.wintertour");
  const nur_ueberschreitungen_label = t("filter.nur_ueberschreitungen");
  const tourstart_ende_andere_stops_label = t(
    "filter.tourstart_ende_andere_stops",
  );

  const anstieg_label = t("filter.anstieg");
  const abstieg_label = t("main.abstieg");
  const hoehenmeter_label = t("filter.hoehenmeter");
  const anfahrtszeit_label = t("main.anfahrtszeit");
  const gehdistanz_label = t("filter.gehdistanz");
  const sportart_label = t("main.sportart");
  const alle_an_abwaehlen_label = t("filter.alle_an_abwaehlen");
  const sprachen_label = t("filter.sprache");

  const schwierigkeit_label = t("filter.schwierigkeit");
  const schwierigkeitswert_label = t("filter.schwierigkeitswert");
  const regionen_label = t("filter.regionen");
  const filter_anwenden_label = t("filter.filter_anwenden");
  const filter_loeschen_label = t("filter.filter_loeschen");
  const minimum_label = t("filter.minimum");
  const maximum_label = t("filter.maximum");

  const hm = t("details.hm_hoehenmeter");
  const km = t("details.km_kilometer");
  const h = t("details.h_hour");

  let sportTypesArray = [
    { "Bike & Hike": t("filter.bike_hike") },
    { Hochtour: t("filter.hochtour") },
    { Klettern: t("filter.klettern") },
    { Klettersteig: t("filter.klettersteig") },
    { Langlaufen: t("filter.langlaufen") },
    { Rodeln: t("filter.rodeln") },
    { Schneeschuh: t("filter.schneeschuh") },
    { Skitour: t("filter.skitour") },
    { Wandern: t("filter.wandern") },
    { Weitwandern: t("filter.weitwandern") },
  ];

  //The purpose of the language array is simply to get the right translations, just like in the sportsTypeArray
  let languageArray = [
    { de: t("filter.deutsch") },
    { en: t("filter.englisch") },
    { fr: t("filter.franzoesisch") },
    { sl: t("filter.slowenisch") },
    { it: t("filter.italienisch") },
  ];

  //loads the filter, including the languages for a specific city
  useEffect(() => {
    let city = searchParams.get("city");
    let range = searchParams.get("range");
    let state = searchParams.get("state");
    let country = searchParams.get("country");
    let type = searchParams.get("type");
    let search = searchParams.get("search");
    let provider = searchParams.get("p");
    let language = searchParams.get("language");

    loadFilter({
      city: city,
      range: range,
      state: state,
      country: country,
      type: type,
      search: search,
      provider: provider,
      language: language,
    });
  }, []);

  useEffect(() => {
    if (!!filter) {
      setMinAscent(getFilterProp(filter, "minAscent", 0));
      setMaxAscent(getFilterProp(filter, "maxAscent", 10000));

      setMinDescent(getFilterProp(filter, "minDescent", 0));
      setMaxDescent(getFilterProp(filter, "maxDescent", 10000));

      setMinDistance(getFilterProp(filter, "minDistance", 0));
      setMaxDistance(getFilterProp(filter, "maxDistance", 10000));

      setMinTransportDuration(getFilterProp(filter, "minTransportDuration", 0));
      setMaxTransportDuration(
        getFilterProp(filter, "maxTransportDuration", 50),
      );

      if (!!filter.ranges) {
        setRangeValues(
          filter.ranges.map((e) => {
            return {
              value: e,
              checked: true,
            };
          }),
        );
      }
      if (!!filter.types) {
        setTypeValues(
          filter.types.map((e) => {
            return {
              value: e,
              checked: true,
            };
          }),
        );
      }
      //sets the languageValues according to the filter
      if (!!filter.languages) {
        setLanguageValues(
          filter.languages.map((e) => {
            return {
              value: e,
              checked: true,
            };
          }),
        );
      }

      let _filter_url = searchParams.get("filter");
      let _filter_local =
        !!localStorage.getItem("filterValues") &&
        localStorage.getItem("filterValues");

      let _filter = !!_filter_local ? _filter_local : _filter_url;

      if (!!_filter) {
        try {
          const parsed = JSON.parse(_filter);

          if (!!parsed) {
            setIfNotUndefined(parsed, "singleDayTour", setSingleDayTour);
            setIfNotUndefined(parsed, "multipleDayTour", setMultipleDayTour);
            setIfNotUndefined(parsed, "summerSeason", setSummerSeason);
            setIfNotUndefined(parsed, "winterSeason", setWinterSeason);
            setIfNotUndefined(parsed, "difficulty", setDifficulty);
            setIfNotUndefined(parsed, "minAscent", setMinAscent);
            setIfNotUndefined(parsed, "maxAscent", setMaxAscent);
            setIfNotUndefined(parsed, "minDescent", setMinDescent);
            setIfNotUndefined(parsed, "maxDescent", setMaxDescent);
            setIfNotUndefined(
              parsed,
              "minTransportDuration",
              setMinTransportDuration,
            );
            setIfNotUndefined(
              parsed,
              "maxTransportDuration",
              setMaxTransportDuration,
            );
            setIfNotUndefined(parsed, "minDistance", setMinDistance);
            setIfNotUndefined(parsed, "maxDistance", setMaxDistance);
            setIfNotUndefined(parsed, "traverse", setTravers);

            if (!!filter && !!filter.ranges && !!parsed.ranges) {
              setRangeValues(
                filter.ranges.map((entry) => {
                  const found = parsed.ranges.find((e) => e === entry);
                  return {
                    value: entry,
                    checked: !!found ? true : false,
                  };
                }),
              );
            }
            if (!!filter && !!filter.types && !!parsed.types) {
              setTypeValues(
                filter.types.map((entry) => {
                  const found = parsed.types.find((e) => e === entry);
                  return {
                    value: entry,
                    checked: !!found ? true : false,
                  };
                }),
              );
            }
            // sets the language values for the filter
            if (!!filter && !!filter.languages && !!parsed.languages) {
              setLanguageValues(
                filter.languages.map((entry) => {
                  const found = parsed.languages.find((e) => e === entry);
                  return {
                    value: entry,
                    checked: !!found,
                  };
                }),
              );
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    if (!!visibleToursGPXNorthEast && !!visibleToursGPXSouthWest) {
      setCoordinatesNorthEast(visibleToursGPXNorthEast);
      setCoordinatesSouthWest(visibleToursGPXSouthWest);
    }
  }, [filter]);

  const countFilterActive = () => {
    let count = 0;
    if (!(!!singleDayTour && !!multipleDayTour)) {
      count++;
    }
    if (!(!!summerSeason && !!winterSeason)) {
      count++;
    }
    if (difficulty !== 10) {
      count++;
    }
    if (!!traverse) {
      count++;
    }
    if (
      minAscent !== getFilterProp(filter, "minAscent") ||
      maxAscent !== getFilterProp(filter, "maxAscent")
    ) {
      count++;
    }
    if (
      minDescent !== getFilterProp(filter, "minDescent") ||
      maxDescent !== getFilterProp(filter, "maxDescent")
    ) {
      count++;
    }
    if (
      minTransportDuration !== getFilterProp(filter, "minTransportDuration") ||
      maxTransportDuration !== getFilterProp(filter, "maxTransportDuration")
    ) {
      count++;
    }
    if (
      minDistance !== getFilterProp(filter, "minDistance") ||
      maxDistance !== getFilterProp(filter, "maxDistance")
    ) {
      count++;
    }
    if (rangeValues.filter((rv) => !!!rv.checked).length > 0) {
      count++;
    }
    if (typeValues.filter((rv) => !!!rv.checked).length > 0) {
      count++;
    }
    //includes the languages in the filter count
    if (languageValues.filter((lv) => !lv.checked).length > 0) {
      count++;
    }
    return count;
  };

  const setIfNotUndefined = (object, key, _function) => {
    if (!!object) {
      if (object[key] !== undefined) {
        _function(object[key]);
      }
    }
  };

  const submit = () => {
    let swLat =
      !!coordinatesSouthWest?.lat && (coordinatesSouthWest?.lat).toFixed(6);
    let swLng =
      !!coordinatesSouthWest?.lng && (coordinatesSouthWest?.lng).toFixed(6);
    let neLat =
      !!coordinatesNorthEast?.lat && (coordinatesNorthEast?.lat).toFixed(6);
    let neLng =
      !!coordinatesNorthEast?.lng && (coordinatesNorthEast?.lng).toFixed(6);

    const filterValues = {
      //coordinates: coordinates,  //Füg den Wert in die URL ein
      // s: !!coordinatesSouthWest?.lat && (coordinatesSouthWest?.lat).toFixed(6),
      s: swLat,
      w: swLng,
      n: neLat,
      e: neLng,
      singleDayTour: mapPosNegValues(singleDayTour),
      multipleDayTour: mapPosNegValues(multipleDayTour),
      summerSeason: mapPosNegValues(summerSeason),
      winterSeason: mapPosNegValues(winterSeason),
      traverse: mapPosNegValues(traverse),
      difficulty: difficulty,
      minAscent: minAscent,
      maxAscent: maxAscent,
      minDescent: minDescent,
      maxDescent: maxDescent,
      minTransportDuration: minTransportDuration,
      maxTransportDuration: maxTransportDuration,
      minDistance: minDistance,
      maxDistance: maxDistance,
      ranges: rangeValues.filter((e) => !!e.checked).map((e) => e.value),
      types: typeValues.filter((e) => !!e.checked).map((e) => e.value),
      languages: languageValues.filter((e) => !!e.checked).map((e) => e.value), // submits also the languages in the filter
    };
    localStorage.setItem("filterValues", JSON.stringify(filterValues));
    localStorage.setItem("filterCount", countFilterActive());
    countFilterActive() > 0 &&
      doSubmit({
        filterValues: filterValues,
        filterCount: countFilterActive(),
      });
  };

  const checkIfCheckedFromCheckbox = (list, key) => {
    return !!(!!list ? list : []).find((l) => l.value === key && !!l.checked);
  };

  const onChangedCheckbox = (list, key, value, _function) => {
    _function(
      (!!list ? list : []).map((entry) => {
        let toPush = { ...entry };
        if (entry.value === key) {
          toPush.checked = value;
        }
        return toPush;
      }),
    );
  };

  const mapPosNegValues = (value) => {
    if (!!value) {
      return value;
    }
    return false;
  };

  const getTypes = () => {
    let types = [];
    if (!!filter && !!filter.types) {
      types = filter.types.map((entry) => {
        const foundType = sportTypesArray.find(
          (typeObj) => Object.keys(typeObj)[0] === entry,
        );
        const translatedValue = foundType ? Object.values(foundType)[0] : "";
        return {
          value: entry,
          label: translatedValue,
        };
      });
    }
    return types.map((type, index) => {
      return (
        <Grid key={index} item xs={6}>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkIfCheckedFromCheckbox(typeValues, type.value)}
                  onChange={({ target }) => {
                    onChangedCheckbox(
                      typeValues,
                      type.value,
                      target.checked,
                      setTypeValues,
                    );
                  }}
                />
              }
              label={type.label}
            />
          </Box>
        </Grid>
      );
    });
  };

  // loads all the language checkboxes
  const getLanguages = () => {
    let languages = [];
    if (!!filter && !!filter.languages) {
      languages = filter.languages.map((entry) => {
        const foundType = languageArray.find(
          (typeObj) => Object.keys(typeObj)[0] === entry,
        );
        const translatedValue = foundType ? Object.values(foundType)[0] : "";
        return {
          value: entry,
          label: translatedValue,
        };
      });
    }

    languages = languages.filter((l) => !!l?.value && !!l?.label);

    return languages.map((type, index) => {
      return (
        <Grid key={index} item xs={6}>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkIfCheckedFromCheckbox(
                    languageValues,
                    type?.value,
                  )}
                  onChange={({ target }) => {
                    onChangedCheckbox(
                      languageValues,
                      type?.value,
                      target.checked,
                      setLanguageValues,
                    );
                  }}
                />
              }
              label={type?.label}
            />
          </Box>
        </Grid>
      );
    });
  };

  const getRanges = () => {
    let ranges = [];
    if (!!filter && !!filter.ranges) {
      ranges = filter.ranges.map((entry) => {
        return {
          value: entry,
          label: entry,
        };
      });
    }

    return ranges.map((type, index) => {
      return (
        <Grid key={index} item xs={6}>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkIfCheckedFromCheckbox(rangeValues, type.value)}
                  onChange={({ target }) => {
                    onChangedCheckbox(
                      rangeValues,
                      type.value,
                      target.checked,
                      setRangeValues,
                    );
                  }}
                />
              }
              label={type.label}
            />
          </Box>
        </Grid>
      );
    });
  };

  const updateAllRangeValues = () => {
    setRangeValues(
      rangeValues.map((rv) => {
        return { ...rv, checked: !!!rangeValuesState };
      }),
    );
    setRangeValuesState(!!!rangeValuesState);
  };

  const updateAllTypeValues = () => {
    setTypeValues(
      typeValues.map((rv) => {
        return { ...rv, checked: !!!typeValuesState };
      }),
    );
    setTypeValuesState(!!!typeValuesState);
  };

  //function to set all checkboxes on either true or false
  const updateAllLanguageValues = () => {
    setLanguageValues(
      languageValues.map((lv) => {
        return { ...lv, checked: !languageValuesState };
      }),
    );
    setLanguageValuesState(!languageValuesState);
  };

  return (
    <Box style={{ height: "100%" }}>
      {!!isLoadingFilter ? (
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
          <Box className={"filter-box-container"}>
            <Box className={"filter-box border"}>
              <Typography variant={"subtitle1"}>{tourlaenge_label}</Typography>
              <Grid container>
                <Grid
                  item
                  xs={6}
                  sx={{
                    borderRight: "1px solid #EAEAEA",
                    paddingRight: "24px",
                  }}
                  className={"toggle-container-left"}
                >
                  <Grid container spacing={0}>
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                      <Typography variant={"subtitle3"}>
                        {tagestour_label}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "right" }}>
                      <Switch
                        checked={singleDayTour}
                        onChange={() => setSingleDayTour(!!!singleDayTour)}
                        disabled={
                          !!!getFilterProp(filter, "isSingleDayTourPossible")
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{ paddingLeft: "24px" }}
                  className={"toggle-container-right"}
                >
                  <Grid container spacing={0}>
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                      <Typography variant={"subtitle3"}>
                        {mehrtagestour_label}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "right" }}>
                      <Switch
                        checked={multipleDayTour}
                        onChange={() => setMultipleDayTour(!!!multipleDayTour)}
                        disabled={
                          !!!getFilterProp(filter, "isMultipleDayTourPossible")
                        }
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
              <Typography variant={"subtitle1"}>{jahreszeit_label}</Typography>
              <Grid container>
                <Grid
                  item
                  xs={6}
                  sx={{
                    borderRight: "1px solid #EAEAEA",
                    paddingRight: "24px",
                  }}
                  className={"toggle-container-left"}
                >
                  <Grid container spacing={0}>
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                      <Typography>{sommertour_label}</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "right" }}>
                      <Switch
                        checked={summerSeason}
                        onChange={() => setSummerSeason(!!!summerSeason)}
                        disabled={
                          !!!getFilterProp(filter, "isSummerTourPossible")
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{ paddingLeft: "24px" }}
                  className={"toggle-container-right"}
                >
                  <Grid container spacing={0}>
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                      <Typography>{wintertour_label}</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "right" }}>
                      <Switch
                        checked={winterSeason}
                        onChange={() => setWinterSeason(!!!winterSeason)}
                        disabled={
                          !!!getFilterProp(filter, "isWinterTourPossible")
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            <Box className={"filter-box"} sx={{ paddingTop: "20px" }}>
              <Box sx={{ paddingTop: "16px" }}>
                <Grid container sx={{ paddingTop: "16px" }}>
                  <Grid item xs={10}>
                    <Typography variant={"subtitle1"}>
                      {nur_ueberschreitungen_label}
                    </Typography>
                    <Typography
                      variant={"subtitle2"}
                      sx={{ fontSize: "16px", fontWeight: 400 }}
                    >
                      {tourstart_ende_andere_stops_label}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: "right" }}>
                    <Switch
                      checked={traverse}
                      onChange={() => setTravers(!!!traverse)}
                      disabled={!!!getFilterProp(filter, "isTraversePossible")}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box className={"filter-box border"} sx={{ paddingTop: "20px" }}>
              <Grid container>
                <Grid
                  item
                  xs={6}
                  sx={{
                    borderRight: "1px solid #EAEAEA",
                    paddingRight: "24px",
                  }}
                  className={"toggle-container-left"}
                >
                  <Typography>
                    {anstieg_label} ({hm})
                  </Typography>
                  <GeneralSlider
                    containerSx={{ marginRight: "10px" }}
                    step={100}
                    min={getFilterProp(filter, "minAscent", 0)}
                    max={getFilterProp(filter, "maxAscent", 5000)}
                    value={[minAscent, maxAscent]}
                    onChange={({ target }) => {
                      setMinAscent(target.value[0]);
                      setMaxAscent(target.value[1]);
                    }}
                  />

                  <Box sx={{ marginTop: "15px" }}>
                    <Grid container spacing={"10px"}>
                      <Grid item xs={6}>
                        <NumberInput
                          id="outlined-basic"
                          label={minimum_label}
                          variant="filled"
                          value={minAscent}
                          endAdormentLabel={null}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <NumberInput
                          id="outlined-basic"
                          label={maximum_label}
                          variant="filled"
                          endAdormentLabel={null}
                          value={maxAscent}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  {maxAscent === 3000 && (
                    <div
                      style={{
                        fontSize: "12px",
                        width: "100%",
                        textAlign: "right",
                        paddingTop: "5px",
                        color: "#8B8B8B",
                      }}
                    >
                      3000+ {hoehenmeter_label}
                    </div>
                  )}
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{ paddingLeft: "24px" }}
                  className={"toggle-container-right"}
                >
                  <Typography>
                    {abstieg_label} ({hm})
                  </Typography>
                  <GeneralSlider
                    containerSx={{ marginRight: "10px" }}
                    step={100}
                    min={getFilterProp(filter, "minDescent", 0)}
                    max={getFilterProp(filter, "maxDescent", 5000)}
                    value={[minDescent, maxDescent]}
                    onChange={({ target }) => {
                      setMinDescent(target.value[0]);
                      setMaxDescent(target.value[1]);
                    }}
                  />
                  <Box sx={{ marginTop: "15px" }}>
                    <Grid container spacing={"10px"}>
                      <Grid item xs={6}>
                        <NumberInput
                          id="outlined-basic"
                          label={minimum_label}
                          variant="filled"
                          endAdormentLabel={null}
                          value={minDescent}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <NumberInput
                          id="outlined-basic"
                          label={maximum_label}
                          variant="filled"
                          endAdormentLabel={null}
                          value={maxDescent}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  {maxDescent === 3000 && (
                    <div
                      style={{
                        fontSize: "12px",
                        width: "100%",
                        textAlign: "right",
                        paddingTop: "5px",
                        color: "#8B8B8B",
                      }}
                    >
                      3000+ {hoehenmeter_label}{" "}
                    </div>
                  )}
                </Grid>
              </Grid>
            </Box>
            <Box className={"filter-box border"} sx={{ paddingTop: "20px" }}>
              <Grid container>
                <Grid
                  item
                  xs={6}
                  sx={{
                    borderRight: "1px solid #EAEAEA",
                    paddingRight: "24px",
                  }}
                  className={"toggle-container-left"}
                >
                  <Typography>
                    {anfahrtszeit_label} ({h})
                  </Typography>
                  <GeneralSlider
                    containerSx={{ marginRight: "10px" }}
                    step={0.5}
                    min={getFilterProp(filter, "minTransportDuration", 0)}
                    max={getFilterProp(filter, "maxTransportDuration", 50)}
                    value={[minTransportDuration, maxTransportDuration]}
                    onChange={({ target }) => {
                      setMinTransportDuration(target.value[0]);
                      setMaxTransportDuration(target.value[1]);
                    }}
                  />

                  <Box sx={{ marginTop: "15px" }}>
                    <Grid container spacing={"10px"}>
                      <Grid item xs={6}>
                        <TextInput
                          id="outlined-basic"
                          label={minimum_label}
                          variant="filled"
                          endAdormentLabel={null}
                          value={convertNumToTime(minTransportDuration)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextInput
                          id="outlined-basic"
                          label={maximum_label}
                          variant="filled"
                          endAdormentLabel={null}
                          value={convertNumToTime(maxTransportDuration)}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{ paddingLeft: "24px" }}
                  className={"toggle-container-right"}
                >
                  <Typography>
                    {gehdistanz_label} ({km})
                  </Typography>
                  <GeneralSlider
                    containerSx={{ marginRight: "10px" }}
                    step={2}
                    min={getFilterProp(filter, "minDistance", 0)}
                    max={getFilterProp(filter, "maxDistance", 10000)}
                    value={[minDistance, maxDistance]}
                    onChange={({ target }) => {
                      setMinDistance(target.value[0]);
                      setMaxDistance(target.value[1]);
                    }}
                  />
                  <Box sx={{ marginTop: "15px" }}>
                    <Grid container spacing={"10px"}>
                      <Grid item xs={6}>
                        <NumberInput
                          id="outlined-basic"
                          label={minimum_label}
                          variant="filled"
                          endAdormentLabel={null}
                          value={minDistance}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <NumberInput
                          id="outlined-basic"
                          label={maximum_label}
                          variant="filled"
                          endAdormentLabel={null}
                          value={maxDistance}
                        />
                        {maxDistance === 80 && (
                          <div
                            style={{
                              fontSize: "12px",
                              width: "100%",
                              textAlign: "left",
                              paddingTop: "5px",
                              color: "#8B8B8B",
                            }}
                          >
                            80+ {km}
                          </div>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box className={"filter-box border"} sx={{ paddingTop: "20px" }}>
              <Typography variant={"subtitle1"}>
                {sportart_label}{" "}
                <Typography
                  variant={"text"}
                  className={"cursor-link"}
                  sx={{ fontSize: "14px" }}
                  onClick={updateAllTypeValues}
                >
                  {alle_an_abwaehlen_label}
                </Typography>
              </Typography>
              <Grid container sx={{ paddingTop: "16px" }}>
                {getTypes()}
              </Grid>
            </Box>
            <Box className={"filter-box border"} sx={{ paddingTop: "20px" }}>
              <Typography variant={"subtitle1"}>
                {sprachen_label}{" "}
                <Typography
                  variant={"text"}
                  className={"cursor-link"}
                  sx={{ fontSize: "14px" }}
                  onClick={updateAllLanguageValues}
                >
                  {alle_an_abwaehlen_label}
                </Typography>
              </Typography>
              <Grid container sx={{ paddingTop: "16px" }}>
                {getLanguages()}
              </Grid>
            </Box>
            <Box className={"filter-box border"} sx={{ paddingTop: "20px" }}>
              <Typography variant={"subtitle1"}>
                {regionen_label}{" "}
                <Typography
                  variant={"text"}
                  className={"cursor-link"}
                  sx={{ fontSize: "14px" }}
                  onClick={updateAllRangeValues}
                >
                  {alle_an_abwaehlen_label}
                </Typography>
              </Typography>
              <Grid container sx={{ paddingTop: "16px" }}>
                {getRanges()}
              </Grid>
            </Box>
            <Box
              className={"filter-box"}
              sx={{ paddingTop: "20px", position: "relative" }}
            >
              <Box sx={{ position: "absolute", top: "20px", right: "20px" }}>
                <Typography variant={"error"}>
                  <TextWithIcon
                    text={difficulty}
                    iconRight={
                      <Intensity
                        style={{
                          stroke: "#FF540B",
                          fill: "none",
                          strokeWidth: 1.5,
                        }}
                      />
                    }
                  />
                </Typography>
              </Box>
              <Typography variant={"subtitle1"}>
                {schwierigkeit_label}
              </Typography>
              <Typography
                variant={"subtitle2"}
                sx={{ fontSize: "14px", fontWeight: 400 }}
              >
                {schwierigkeitswert_label}
              </Typography>
              <DifficultySlider
                containerSx={{ marginTop: "20px", marginRight: "10px" }}
                defaultValue={10}
                value={difficulty}
                onChange={({ target }) => setDifficulty(target.value)}
              />
            </Box>
          </Box>
          <Box
            className={"filter-box"}
            sx={{
              backgroundColor: "#fff",
              width: "100%",
              boxSizing: "border-box",
              borderTop: "1px solid #EAEAEA",
              display: "flex",
              padding: "0",
              justifyContent: { xs: "center", sm: "end" },
            }}
          >
            <Box sx={{ pt: "18px" }}>
              <Button
                variant={"text"}
                sx={{ marginRight: "15px", color: "#8B8B8B" }}
                onClick={resetFilter}
              >
                {" "}
                {filter_loeschen_label}
              </Button>
              <Button variant={"contained"} onClick={submit}>
                {countFilterActive() === 0 ? "" : countFilterActive()}{" "}
                {filter_anwenden_label}
              </Button>
              {/* <Button
                            variant={"contained"}
                            onClick={submit}
                            disabled={countFilterActive() === 0}
                            className={countFilterActive() === 0 ? 'disabled-button' : ''}
                            >
                            {countFilterActive() === 0 ? '' : countFilterActive()} 
                            {" "}{filter_anwenden_label} 
                        </Button> */}
            </Box>
          </Box>
        </Fragment>
      )}
    </Box>
  );
}

const mapDispatchToProps = {
  loadFilter,
};

const mapStateToProps = (state) => {
  return {
    filter: state.tours.filter,
    isLoadingFilter: state.tours.isLoadingFilter,
    visibleToursGPXSouthWest: state.tours.visibleToursGPX._southWest,
    visibleToursGPXNorthEast: state.tours.visibleToursGPX._northEast,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Filter);

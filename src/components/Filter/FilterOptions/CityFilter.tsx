import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useGetCitiesQuery } from "../../../features/apiSlice";
import { CityObject } from "../../../features/searchSlice";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { CustomIcon } from "../../../icons/CustomIcon";

interface CityFilterProps {
  tempCity: CityObject | null;
  setTempCity: (city: CityObject | null) => void;
}

export default function CityFilter({ tempCity, setTempCity }: CityFilterProps) {
  const { t } = useTranslation();
  const { data: allCities = [], isFetching: isLoading } = useGetCitiesQuery();

  return (
    <Box className="filter-box border" sx={{ paddingTop: "20px" }}>
      <Typography variant="subtitle1">
        {t("filter.filter_city_description")}
      </Typography>
      <Box sx={{ paddingTop: "16px" }}>
        <Autocomplete
          sx={{
            "& .MuiAutocomplete-inputRoot": {
              paddingRight: "27px !important",
            },
            "& .MuiAutocomplete-endAdornment": { right: "9px" },
          }}
          slotProps={{
            paper: { sx: { borderRadius: 3 } },
            listbox: { sx: { borderRadius: 3 } },
          }}
          autoHighlight
          blurOnSelect
          clearOnBlur
          selectOnFocus
          size="small"
          getOptionLabel={(option) => option.label}
          options={allCities}
          value={tempCity}
          onChange={(_event, newValue) => {
            setTempCity(newValue);
          }}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderOption={(props, option) => {
            // eslint-disable-next-line react/prop-types
            const { key, ...otherProps } = props;
            return (
              <ListItem key={key} {...otherProps}>
                <ListItemIcon>
                  <div
                    style={{
                      borderRadius: "10px",
                      backgroundColor: "#d9d9d9",
                      height: "40px",
                      width: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CustomIcon
                      name="transportTrain"
                      style={{
                        strokeWidth: "1px",
                        fill: "#000",
                        stroke: "none",
                        marginRight: "8px",
                      }}
                    />
                  </div>
                </ListItemIcon>
                <ListItemText primary={option.label} />
              </ListItem>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={t("start.heimatbahnhof")}
              variant="outlined"
              slotProps={{
                ...params.slotProps,
                input: {
                  ...params.slotProps?.input,
                  startAdornment: (
                    <CustomIcon
                      name="transportTrain"
                      style={{
                        strokeWidth: "1px",
                        fill: "#5c5959",
                        stroke: "none",
                        paddingLeft: "8px",
                        paddingRight: "8px",
                      }}
                    />
                  ),
                  endAdornment: (
                    <Fragment>
                      {isLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.slotProps?.input?.endAdornment}
                    </Fragment>
                  ),
                },
              }}
            />
          )}
        />
      </Box>
    </Box>
  );
}

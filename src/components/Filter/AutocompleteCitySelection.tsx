import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useGetCitiesQuery } from "../../features/apiSlice";
import { CityObject } from "../../features/searchSlice";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { CustomIcon } from "../../icons/CustomIcon";

interface AutocompleteCitySelectionProps {
  value: CityObject | null;
  onChange: (city: CityObject | null) => void;
}

export default function AutocompleteCitySelection({
  value,
  onChange,
}: AutocompleteCitySelectionProps) {
  const { t } = useTranslation();
  const { data: allCities = [], isFetching: isLoading } = useGetCitiesQuery();

  return (
    <Autocomplete
      sx={{
        "& .MuiAutocomplete-clearIndicator": { display: "none" },
        "& .MuiAutocomplete-inputRoot": { paddingRight: "27px !important" },
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
      value={value}
      onChange={(_event, newValue) => {
        onChange(newValue);
      }}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderOption={(props, option) => {
        // eslint-disable-next-line react/prop-types
        const { key, ...otherProps } = props;
        return (
          <ListItem
            key={key}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
            {...otherProps}
          >
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
            <ListItemText primary={option?.label} />
          </ListItem>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t("start.heimatbahnhof")}
          sx={{
            "& .MuiInputBase-input": {
              color: "#6d6b6b",
            },
          }}
          variant="outlined"
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
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
                  {params.slotProps.input.endAdornment}
                </Fragment>
              ),
            },
          }}
        />
      )}
    />
  );
}

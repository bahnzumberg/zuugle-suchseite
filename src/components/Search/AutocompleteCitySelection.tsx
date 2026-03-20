import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useGetCitiesQuery } from "../../features/apiSlice";
import { RootState } from "../..";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks";
import { cityUpdated } from "../../features/searchSlice";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { CustomIcon } from "../../icons/CustomIcon";

export default function AutocompleteCitySelection({
  inputVariant,
}: {
  inputVariant?: "standard" | "outlined" | "filled";
}) {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const city = useSelector((state: RootState) => state.search.city);
  const { data: allCities = [], isFetching: isLoading } = useGetCitiesQuery();

  return (
    <Autocomplete
      sx={{ "& .MuiAutocomplete-clearIndicator": { display: "none" } }}
      slotProps={{
        paper: { sx: { borderRadius: 3 } },
        listbox: { sx: { borderRadius: 3 } },
      }}
      autoHighlight
      blurOnSelect
      clearOnBlur
      selectOnFocus
      getOptionLabel={(option) =>
        t("search.ab_heimatbahnhof") + " " + option.label
      }
      options={allCities}
      value={city ?? null}
      onChange={(event, newValue) => {
        dispatch(cityUpdated(newValue));
      }}
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
              color: "#6d6b6b", // Text color
            },
          }}
          variant={inputVariant}
          slotProps={{
            input: {
              ...params.InputProps,
              disableUnderline: true,
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
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            },
          }}
        />
      )}
    />
  );
}

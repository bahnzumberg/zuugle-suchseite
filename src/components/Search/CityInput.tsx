import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { CustomIcon } from "../../icons/CustomIcon";

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#4992FF",
  },
  borderRadius: "20px",
  border: "1.5px solid #DDD",
  "& .MuiInput-underline:after": {
    borderBottomColor: "#DDD",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "0",
    },
    "&:hover fieldset": {
      borderColor: "#DDD",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#DDD",
      borderWidth: 0,
    },
  },
});

export interface CityInputProps {
  city: string;
  setCity: (city: string) => void;
}

export default function CityInput({ city, setCity }: CityInputProps) {
  const placeholder = () => {
    const host = window.location.host;
    if (host.indexOf("zuugle.at") >= 0) {
      return "Wien, Graz, ...";
    } else if (host.indexOf("zuugle.de") >= 0) {
      return "München, Rosenheim, ...";
    } else if (host.indexOf("zuugle.ch") >= 0) {
      return "Zürich, ...";
    } else if (host.indexOf("zuugle.si") >= 0) {
      return "Ljubljana, Maribor,...";
    } else if (host.indexOf("zuugle.it") >= 0) {
      return "Milano, Bozen, ...";
    } else if (host.indexOf("zuugle.fr") >= 0) {
      return "Lyon, Marseille, ...";
    } else if (host.indexOf("zuugle.li") >= 0) {
      return "Vaduz";
    } else {
      return "Wien, Graz, ...";
    }
  };

  return (
    <CssTextField
      className={"city-input"}
      placeholder={placeholder()}
      variant="outlined"
      fullWidth
      value={city}
      autoComplete={"off"}
      key={"city-input"}
      onChange={(event) => {
        setCity(event.target.value);
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <CustomIcon name="transportTrain" />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            {city && (
              <IconButton
                aria-label="clear city input"
                onClick={() => setCity("")}
                edge="end"
                size="small"
              >
                <CustomIcon name="clearSearchIcon" style={{ strokeWidth: 0 }} />
              </IconButton>
            )}
          </InputAdornment>
        ),
        className: "search-bar-input",
      }}
    />
  );
}

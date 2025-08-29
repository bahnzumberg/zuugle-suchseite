import * as React from "react";
import Box from "@mui/material/Box";
import CityInput from "./CityInput";
import { CityResultList } from "./CityResultList";
import { useEffect, useState } from "react";
import { useGetCitiesQuery } from "../../features/apiSlice";
import { RootState } from "../..";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { theme } from "../../theme";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../hooks";
import { CityObject, cityUpdated } from "../../features/searchSlice";

export interface FullScreenCityInputProps {
  showCitySearch: boolean;
  setShowCitySearch: (value: boolean) => void;
}

export default function FullScreenCityInput({
  showCitySearch,
  setShowCitySearch,
}: FullScreenCityInputProps) {
  const { t } = useTranslation();
  const [cityInput, setCityInput] = useState("");

  // load all cities once, apply search filter only in frontend
  const { data: cities = [], isFetching: isCitiesLoading } =
    useGetCitiesQuery();
  const initialCity = useSelector((state: RootState) => state.search.city);

  useEffect(() => {
    setCityInput(initialCity?.label || "");
  }, [initialCity]);

  const style = {
    borderRadius: "18px",
  };

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useAppDispatch();

  function selectCity(city: CityObject) {
    // set new city in redux state
    dispatch(cityUpdated(city));
    setShowCitySearch(false);
  }

  return (
    <Dialog
      open={showCitySearch}
      onClose={() => {
        setShowCitySearch(false);
      }}
      fullScreen={fullScreen}
      sx={{ "& .MuiDialog-paper": style }}
      className={"my-modal"}
    >
      <DialogTitle>
        <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
          {t("start.heimatbahnhof")}
        </Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => {
          setShowCitySearch(false);
        }}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box>
          <CityInput city={cityInput} setCity={setCityInput} />
        </Box>
        <Box
          className={"result-container"}
          sx={{ overflowY: "auto", mt: "8px" }}
        >
          <CityResultList
            cities={cities}
            cityInput={cityInput}
            isCityLoading={isCitiesLoading}
            selectCity={selectCity}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

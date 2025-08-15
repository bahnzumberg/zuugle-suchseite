import * as React from "react";
import Box from "@mui/material/Box";
import CityInput from "./CityInput";
import { CityResultList } from "./CityResultList";
import { useEffect, useState } from "react";
import { useGetCitiesQuery } from "../../features/apiSlice";
import { RootState } from "../..";
import { useSelector } from "react-redux";

export default function FullScreenCityInput() {
  const [cityInput, setCityInput] = useState("");

  // load all cities once, apply search filter only in frontend
  const { data: cities = [], isFetching: isCitiesLoading } = useGetCitiesQuery(
    {},
  );

  const initialCity = useSelector((state: RootState) => state.city);

  useEffect(() => {
    setCityInput(initialCity?.label || "");
  }, [initialCity]);

  return (
    <Box>
      <Box>
        <CityInput city={cityInput} setCity={setCityInput} />
      </Box>
      <Box
        className={"result-container"}
        maxHeight="335px"
        sx={{ overflowY: "auto", mt: "8px" }}
      >
        <CityResultList
          cities={cities}
          cityInput={cityInput}
          setCityInput={setCityInput}
          isCityLoading={isCitiesLoading}
        />
      </Box>
    </Box>
  );
}

import * as React from "react";
import Box from "@mui/material/Box";
import CityInput from "./CityInput";
import { CityResultList } from "./CityResultList";
import { useEffect, useState } from "react";
import { loadFavouriteTours } from "../../actions/tourActions";
import { compose } from "redux";
import { connect } from "react-redux";
import { useGetCitiesQuery } from "../../features/apiSlice";

export interface FullScreenCityInputProps {
  initialCity: any;
  onSelect: any;
  cityOne: any;
  idOne: any;
  pageKey: any;
}

function FullScreenCityInput({
  initialCity,
  onSelect,
  cityOne,
  idOne,
  pageKey,
}: FullScreenCityInputProps) {
  const [cityInput, setCityInput] = useState("");
  const [city, setCity] = useState(null);

  // load all cities once, apply search filter only in frontend
  const { data: cities = [], isFetching: isCitiesLoading } = useGetCitiesQuery(
    {},
  );

  useEffect(() => {
    setCityInput(initialCity);
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
          setCity={setCity}
          cityInput={cityInput}
          setCityInput={setCityInput}
          isCityLoading={isCitiesLoading}
          loadFavouriteTours={
            !!pageKey && pageKey === "start" && loadFavouriteTours
          }
          onSelect={onSelect}
          idOne={idOne}
          cityOne={cityOne}
        />
      </Box>
    </Box>
  );
}

const mapDispatchToProps = {
  loadFavouriteTours,
};

const mapStateToProps = (state) => {
  return {
    loading: state.tours.loading,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  FullScreenCityInput,
);

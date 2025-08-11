import * as React from "react";
import Box from "@mui/material/Box";
import CityInput from "./CityInput";
import { CityResultList } from "./CityResultList";
import { useEffect, useState } from "react";
import { loadCities } from "../../actions/cityActions";
import { loadFavouriteTours } from "../../actions/tourActions";
import { compose } from "redux";
import { connect } from "react-redux";

export interface FullScreenCityInputProps {
  loadCities: any;
  cities: any;
  isCityLoading: any;
  initialCity: any;
  onSelect: any;
  cityOne: any;
  idOne: any;
  pageKey: any;
}

function FullScreenCityInput({
  loadCities,
  cities,
  isCityLoading,
  initialCity,
  onSelect,
  cityOne,
  idOne,
  pageKey,
}: FullScreenCityInputProps) {
  const [cityInput, setCityInput] = useState("");
  const [city, setCity] = useState(null);

  useEffect(() => {
    setCityInput(initialCity);
  }, [initialCity]);

  return (
    <Box>
      <Box>
        <CityInput
          loadCities={loadCities}
          city={cityInput}
          setCity={setCityInput}
        />
      </Box>
      <Box
        className={"result-container"}
        maxHeight="335px"
        sx={{ overflowY: "auto", mt: "8px" }}
      >
        <CityResultList
          cities={cities}
          setCity={setCity}
          setCityInput={setCityInput}
          isCityLoading={isCityLoading}
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
  loadCities,
  loadFavouriteTours,
};

const mapStateToProps = (state) => {
  return {
    loading: state.tours.loading,
    cities: state.cities.cities,
    isCityLoading: state.cities.loading,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  FullScreenCityInput,
);

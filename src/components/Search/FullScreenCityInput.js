import * as React from "react";
import Box from "@mui/material/Box";
import CityInput from "./CityInput";
import { CityResultList } from "./CityResultList";
import { useEffect, useState } from "react";
import { loadCities } from "../../actions/cityActions";
import { loadFavouriteTours, loadTours } from "../../actions/tourActions";
import { loadRanges } from "../../actions/rangeActions";
import { hideModal, showModal } from "../../actions/modalActions";
import { compose } from "redux";
import { connect } from "react-redux";
import {useParams, useNavigate} from "react-router-dom";


function FullScreenCityInput({
  loadCities,
  loadRanges,
  cities,
  searchParams,
  setSearchParams,
  isCityLoading,
  initialCity,
  onSelect,
  cityOne,
  idOne,
  pageKey
}) {
  const [cityInput, setCityInput] = useState("");
  const [city, setCity] = useState(null);
  const [openCitySearch, setOpenCitySearch] = useState(false);

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
          isOpen={openCitySearch}
          showRightIcon={false}
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
          loadFavouriteTours={!!pageKey && pageKey==='start' && loadFavouriteTours}
          loadRanges={loadRanges}
          setOpenCitySearch={setOpenCitySearch}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          showNotFoundEntry={false}
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
  loadTours,
  loadFavouriteTours,
  loadRanges,
  showModal,
  hideModal,
};

const mapStateToProps = (state) => {
  return {
    loading: state.tours.loading,
    cities: state.cities.cities,
    isCityLoading: state.cities.loading,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  FullScreenCityInput
);

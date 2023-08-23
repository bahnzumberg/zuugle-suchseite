<<<<<<< HEAD
import * as React from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {loadFavouriteTours, loadTours} from "../../actions/tourActions";
import {compose} from "redux";
import {connect} from "react-redux";
import {loadCities} from "../../actions/cityActions";
import {Fragment, useEffect, useState} from "react";
import CityInput from "./CityInput";
import {loadRegions} from "../../actions/regionActions";
import {useSearchParams} from "react-router-dom";
import {hideModal, showModal} from "../../actions/modalActions";
import {CityResultList} from "./CityResultList";
=======
import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { loadFavouriteTours, loadTours } from "../../actions/tourActions";
import { compose } from "redux";
import { connect } from "react-redux";
import { loadCities } from "../../actions/cityActions";
import { Fragment, useEffect, useState } from "react";
import CityInput from "./CityInput";
import { loadRegions } from "../../actions/regionActions";
import { useSearchParams } from "react-router-dom";
import { hideModal, showModal } from "../../actions/modalActions";
import { CityResultList } from "./CityResultList";
>>>>>>> dev-drop-slovenia-front2

//description
//a search bar UI component that allows users to search for cities and potentially triggers other actions related to the searched city.
// The component receives various props, including functions for loading cities, regions, tours, and favourite tours, as well as functions for showing and hiding modals. It also uses React hooks such as useState and useEffect.
// The component renders a CityInput component and a CityResultList component conditionally based on the openCitySearch state. The CityInput component allows users to input a city name, and the CityResultList component displays a list of cities that match the search query.
// When a city is selected from the list, the onCitySelected function is called, and the selected city is passed as an argument. The setSearchParams function is also called to update the search parameters with the selected city.
<<<<<<< HEAD
function SearchLight({loadCities, cities, loadRegions, regions, loadTours, isCityLoading, goto, isMain, loadFavouriteTours, showModal, hideModal, onCitySelected}){

    const [searchParams, setSearchParams] = useSearchParams();
    const [cityInput, setCityInput] = useState("");
    const [city, setCity] = useState(null);
    const [openCitySearch, setOpenCitySearch] = useState(false);

    useEffect(() => {
        loadCities({});
    }, [])

    const setCityInputMiddleware = (value) => {
        setCityInput(value);
        if(!!!value){
            searchParams.delete('city');
            setSearchParams(searchParams);
            loadFavouriteTours({sort: "relevanz", limit: 10});
        }
    }

    const onFocusCity = (value) => {
        setOpenCitySearch(!!value)
    }

    return <Fragment>
        <Box>
            <Grid container rowSpacing={0} columnSpacing={1} className={"search-button-container"} >
                <Grid item xs={12}>
                    <CityInput
                        loadCities={loadCities}
                        city={cityInput}
                        setCity={setCityInputMiddleware}
                        onFocus={onFocusCity}
                        isOpen={openCitySearch}
                    />
                </Grid>
            </Grid>
        </Box>

        {(!!openCitySearch) &&
            <Box className={"result-container"}>
                <CityResultList
                    cities={cities}
                    setCity={setCity}
                    setCityInput={setCityInput}
                    onFocusCity={onFocusCity}
                    isCityLoading={isCityLoading}
                    loadRegions={loadRegions}
                    loadFavouriteTours={loadFavouriteTours}
                    setOpenCitySearch={setOpenCitySearch}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    onSelect={onCitySelected}
                />
            </Box>
        }

    </Fragment>
}

const mapDispatchToProps = {
    loadCities,
    loadRegions,
    loadTours,
    loadFavouriteTours,
    showModal,
    hideModal,
};


const mapStateToProps = (state) => {
    return {
        loading: state.tours.loading,
        cities: state.cities.cities,
        regions: state.regions.regions,
        isCityLoading: state.cities.loading,
        isRegionLoading: state.regions.loading,
    }
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
)(SearchLight)
=======
function SearchLight({
  loadCities,
  cities,
  loadRegions,
  regions,
  loadTours,
  isCityLoading,
  goto,
  isMain,
  loadFavouriteTours,
  showModal,
  hideModal,
  onCitySelected,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cityInput, setCityInput] = useState("");
  const [city, setCity] = useState(null);
  const [openCitySearch, setOpenCitySearch] = useState(false);

  useEffect(() => {
    loadCities({});
  }, []);

  const setCityInputMiddleware = (value) => {
    setCityInput(value);
    if (!!!value) {
      searchParams.delete("city");
      setSearchParams(searchParams);
      loadFavouriteTours({ sort: "relevanz", limit: 10 });
    }
  };

  const onFocusCity = (value) => {
    setOpenCitySearch(!!value);
  };

  return (
    <Fragment>
      <Box>
        <Grid
          container
          rowSpacing={0}
          columnSpacing={1}
          className={"search-button-container"}
        >
          <Grid item xs={12}>
            <CityInput
              loadCities={loadCities}
              city={cityInput}
              setCity={setCityInputMiddleware}
              onFocus={onFocusCity}
              isOpen={openCitySearch}
            />
          </Grid>
        </Grid>
      </Box>

      {!!openCitySearch && (
        <Box className={"result-container"}>
          <CityResultList
            cities={cities}
            setCity={setCity}
            setCityInput={setCityInput}
            onFocusCity={onFocusCity}
            isCityLoading={isCityLoading}
            loadRegions={loadRegions}
            loadFavouriteTours={loadFavouriteTours}
            setOpenCitySearch={setOpenCitySearch}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSelect={onCitySelected}
          />
        </Box>
      )}
    </Fragment>
  );
}

const mapDispatchToProps = {
  loadCities,
  loadRegions,
  loadTours,
  loadFavouriteTours,
  showModal,
  hideModal,
};

const mapStateToProps = (state) => {
  return {
    loading: state.tours.loading,
    cities: state.cities.cities,
    regions: state.regions.regions,
    isCityLoading: state.cities.loading,
    isRegionLoading: state.regions.loading,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  SearchLight
);
>>>>>>> dev-drop-slovenia-front2

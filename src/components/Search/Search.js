import * as React from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {loadFavouriteTours, loadTours} from "../../actions/tourActions";
import {compose} from "redux";
import {connect} from "react-redux";
import {loadCities} from "../../actions/cityActions";
import {Fragment, useEffect, useState} from "react";
import CityInput from "../CityInput";
import {loadRegions} from "../../actions/regionActions";
import RegionInput from "../RegionInput";
import {useSearchParams} from "react-router-dom";
import {isResponsive, parseIfNeccessary, setOrRemoveSearchParam} from "../../utils/globals";
import {useNavigate} from "react-router";
import ZuugleLogo from "../../icons/ZuugleLogo";
import {hideModal, showModal} from "../../actions/modalActions";
import {CityResultList} from "./CityResultList";
import FullScreenCityInput from "../FullScreenCityInput";
import {RegionResultList} from "./RegionResultList";
import FullScreenRegionInput from "../FullScreenRegionInput";


export function Search({loadCities, cities, loadRegions, regions, loadTours, isCityLoading, goto, isMain, loadFavouriteTours, showModal, hideModal, allCities}){

    const [searchParams, setSearchParams] = useSearchParams();
    const [cityInput, setCityInput] = useState("");
    const [regionInput, setRegionInput] = useState("");
    const [city, setCity] = useState(null);
    const [openCitySearch, setOpenCitySearch] = useState(false);
    const [region, setRegion] = useState(null);
    const [openRegionSearch, setOpenRegionSearch] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        let city = searchParams.get('city');
        let range = searchParams.get('range');
        let state = searchParams.get('state');
        let country = searchParams.get('country');
        let type = searchParams.get('type');
        let search = searchParams.get('search');
        let filter = searchParams.get('filter');
        let orderId = searchParams.get('sort');
        let provider = searchParams.get('p');

        if(!!city && !!allCities){
            const cityEntry = allCities.find(e => e.value == city);
            if(!!cityEntry){
                setCityInput(cityEntry.label);
                setCity(cityEntry);
                writeCityToLocalStorage(city);

                /** load regions initially */
                loadRegions({city: city});
            }
        }


        if(!!!orderId || orderId == "relevanz"){
            searchParams.set("sort", "relevanz");
            setSearchParams(searchParams);
        }
// console.log( "serachParams L: 65:", searchParams);
        if(!!range){
            setRegionInput(range);
            setRegion({value: range, label: range, type: "range"});
        }

        if(!!state){
            setRegionInput(state);
            setRegion({value: state, label: state, type: "state"});
        }

        if(!!country){
            setRegionInput(country);
            setRegion({value: country, label: country, type: "country"});
        }

        if(!!type){
            setRegionInput(type);
            setRegion({value: type, label: type, type: "type"});
        }

        if(!!search){
            setRegionInput(search);
        }

        //return if start page - no load
        if(!!!isMain){
            return;
        }

        let _filter = !!filter ? parseIfNeccessary(filter) : null;
        if(!!_filter){
            filter = {
                ..._filter,
                ignore_filter: true
            }
        } else {
            filter = {
                ignore_filter: true
            }
        }
        loadTours({
            city: city,
            range: range,
            state: state,
            country: country,
            type: type,
            search: search,
            filter: filter,
            sort: orderId,
            provider: provider,
            map: searchParams.get('map')
        })

    }, [
        searchParams && searchParams.get('city'),
        searchParams && searchParams.get('filter'),
        searchParams && searchParams.get('sort'),
        searchParams && searchParams.get('search'),
        searchParams && searchParams.get('type'),
        searchParams && searchParams.get('sort'),
        searchParams && searchParams.get('range'),
        searchParams && searchParams.get('map'),
        searchParams && searchParams.get('p'),
    ])

    const writeCityToLocalStorage = (city) => {
        localStorage.setItem('city', city);
    }

    const changeTextMiddleware = (value, _function, _resetFunction) => {
        _function(value);
        _resetFunction(null);
    }

    const setCityInputMiddleware = (value) => {
        setCityInput(value);
        if(!!!value){
            searchParams.delete('city');
            setSearchParams(searchParams);
            loadFavouriteTours({sort: "relevanz", limit: 10, ranges: true});
        }
    }

    const onFocusCity = (value) => {
        setOpenCitySearch(!!value)
    }
    const onFocusRegion = (value) => {
        setOpenRegionSearch(!!value)
    }

    const search = (tempRegion = null) => {
        let values = {};
        if(!!city && !!city.value){
            values.city = city.value;
        }

        let _region = region;
        if(!!tempRegion){
            _region = tempRegion;
        }

        if(!!_region && !!_region.value){
            values[_region.type] = _region.value;
        } else if(!!regionInput){
            values.search = regionInput;
        }

        if(!!searchParams.get('sort')){
            values.sort = searchParams.get('sort');
        } else {
            values.sort = "relevanz";
        }

        values.map = searchParams.get('map');
        values.provider = searchParams.get('p');

        searchParams.delete("filter");

        setOrRemoveSearchParam(searchParams, "city", values.city);
        setOrRemoveSearchParam(searchParams, "range", values.range);
        setOrRemoveSearchParam(searchParams, "state", values.state);
        setOrRemoveSearchParam(searchParams, "country", values.country);
        setOrRemoveSearchParam(searchParams, "type", values.type);
        setOrRemoveSearchParam(searchParams, "search", values.search);

        setSearchParams(searchParams);
        for (const entry of searchParams.entries()) {
            console.log(entry);
          }
console.log("You are here, 195")
        if(!!goto){
            navigate(goto + "?" + searchParams);
        } else {
            loadTours(values).then(res => {
                window.scrollTo({top: 0});
            })
        }
    }

    const gotoHome = () => {
        let _city = searchParams.get('city');
        navigate(`/?${!!_city?'city='+_city:''}`)
    }

    const showCityModal = () => {
        showModal("MODAL_COMPONENT", {
            CustomComponent: FullScreenCityInput,
            searchParams,
            initialCity: cityInput,
            onSelect: (city) => {
                hideModal();
                if(!!city){
                    setCityInput(city.label);
                    setCity(city);
                }
            },
            setSearchParams,
            title: "",
            modalSize: "lg",
            onBack: () => {
                hideModal();
            }
        });
    }

    const showRegionInput = () => {
        showModal("MODAL_COMPONENT", {
            CustomComponent: FullScreenRegionInput,
            searchParams,
            initialRegion: regionInput,
            onSelect: (region) => {
                hideModal();
                if(!!region){
                    setRegionInput(region.value);
                    setRegion(region);
                    search(region);
                }
            },
            setSearchParams,
            title: "",
            modalSize: "lg",
            onBack: () => {
                hideModal();
            }
        });

    }

    const onCustomRegionSubmit = () => {
        setOpenRegionSearch(false);
        search();
    }

    const resetRegionInput = () => {
        setRegionInput("");
        setRegion(null);
        setOpenRegionSearch(false);
        searchParams.delete("search");
        searchParams.delete("range");
        searchParams.delete("type");
        setSearchParams(searchParams);
    }

    return <Fragment>
        <Box>
            {
                !!isMain ?   <Grid container>
                    <Grid item style={{maxWidth: "60px", flex: 1, alignSelf: "center", textAlign: "left"}} onClick={gotoHome} className={"cursor-link"}>
                        <ZuugleLogo />
                    </Grid>
                    <Grid item style={{width: "100%", flex: 1}}>
                        <Grid container rowSpacing={0} columnSpacing={1} className={"search-button-container"} >
                            <Grid item xs={12} md={5}>
                                <CityInput loadCities={loadCities} city={cityInput} setCity={setCityInput} onFocus={!!!isResponsive() && onFocusCity} isOpen={openCitySearch} onClick={!!isResponsive() && showCityModal} disabled={!!isResponsive()}/>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                {console.log("You are at 282")}
                                <RegionInput setOpenRegionSearch={setOpenRegionSearch} onCustomSubmit={onCustomRegionSubmit} loadRegions={loadRegions} region={regionInput} setRegion={(value) => changeTextMiddleware(value, setRegionInput, setRegion)} onFocus={!!!isResponsive() && onFocusRegion} isOpen={openRegionSearch} city={city} onClick={!!isResponsive() && showRegionInput} disabled={!!isResponsive()} resetInput={resetRegionInput}/>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button variant="contained" fullWidth style={{height: 55}} onClick={() => search()}>Ergebnisse anzeigen</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid> :
                    <Grid container rowSpacing={0} columnSpacing={1} className={"search-button-container"} >
                        <Grid item xs={12} md={5}>
                            <CityInput loadCities={loadCities} city={cityInput} setCity={setCityInputMiddleware} onFocus={!!!isResponsive() && onFocusCity} isOpen={openCitySearch} onClick={!!isResponsive() && showCityModal} disabled={!!isResponsive()}/>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <RegionInput setOpenRegionSearch={setOpenRegionSearch} onCustomSubmit={onCustomRegionSubmit} loadRegions={loadRegions} region={regionInput} setRegion={(value) => changeTextMiddleware(value, setRegionInput, setRegion)} onFocus={!!!isResponsive() && onFocusRegion} isOpen={openRegionSearch} city={city} onClick={!!isResponsive() && showRegionInput} disabled={!!isResponsive()} resetInput={resetRegionInput}/>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button variant="contained" fullWidth style={{height: 55}} onClick={() => search()}>Ergebnisse anzeigen</Button>
                        </Grid>
                    </Grid>

            }



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
                />
            </Box>
        }

        {(!!openRegionSearch) &&
            <Box className={"result-container regions"}>
                <RegionResultList
                    regions={regions}
                    setRegion={setRegion}
                    setRegionInput={setRegionInput}
                    onFocusRegion={onFocusRegion}
                    setOpenRegionSearch={setOpenRegionSearch}
                    regionInput={regionInput}
                    search={search}
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
    hideModal
};


const mapStateToProps = (state) => {
    return {
        loading: state.tours.loading,
        cities: state.cities.cities,
        allCities: state.cities.all_cities,
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
)(Search)
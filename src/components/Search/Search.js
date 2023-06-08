import * as React from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
// import Button from "@mui/material/Button"
import { loadFavouriteTours, loadTours } from "../../actions/tourActions"
import { compose } from "redux"
import { connect } from "react-redux"
import { loadCities } from "../../actions/cityActions"
import { Fragment, useEffect, useState } from "react"
// import CityInput from "./CityInput"
import { loadRegions } from "../../actions/regionActions"
// import RegionInput from "./RegionInput"
import { useSearchParams } from "react-router-dom"
import {
    // isResponsive,
    parseIfNeccessary,
    setOrRemoveSearchParam,
} from "../../utils/globals"
import { useNavigate } from "react-router"
import { hideModal, showModal } from "../../actions/modalActions"
// import { CityResultList } from "./CityResultList"
import FullScreenCityInput from "./FullScreenCityInput"
// import { RegionResultList } from "./RegionResultList"
import FullScreenRegionInput from "./FullScreenRegionInput"
import { useTranslation } from "react-i18next"
import FilterIcon from "../../icons/FilterIcon"
import SearchIcon from "../../icons/SearchIcon"
import IconButton from "@mui/material/IconButton"
import GoIcon from "../../icons/GoIcon"
import TextInput from "../TextInput"

export function Search({
    loadRegions,
    loadTours,
    goto,
    isMain,
    showModal,
    hideModal,
    allCities,
    isMapView,
    // additional arguments
    // loadCities,
    // cities,
    // regions,
    // isCityLoading,
    // loadFavouriteTours,
}) {
    const [searchParams, setSearchParams] = useSearchParams()
    const [cityInput, setCityInput] = useState("")
    const [regionInput, setRegionInput] = useState("")
    const [city, setCity] = useState(null)
    // const [openCitySearch, setOpenCitySearch] = useState(false)
    const [region, setRegion] = useState(null)
    // const [openRegionSearch, setOpenRegionSearch] = useState(false)
    const [activeFilter, setActiveFilter] = useState(false)
    const initialIsMapView = isMapView || false

    const navigate = useNavigate()
    const { t } = useTranslation()

    useEffect(() => {
        let city = searchParams.get("city")
        let range = searchParams.get("range")
        let state = searchParams.get("state")
        let country = searchParams.get("country")
        let type = searchParams.get("type")
        let search = searchParams.get("search")
        let filter = searchParams.get("filter")
        let orderId = searchParams.get("sort")
        let provider = searchParams.get("p")

        if (!!city && !!allCities) {
            const cityEntry = allCities.find((e) => e.value == city)
            if (!!cityEntry) {
                setCityInput(cityEntry.label)
                setCity(cityEntry)
                writeCityToLocalStorage(city)

                /** load regions initially */
                loadRegions({ city: city })
            }
        }

        if (!!!orderId || orderId == "relevanz") {
            searchParams.set("sort", "relevanz")
            setSearchParams(searchParams)
        }
        // console.log( "serachParams L: 65:", searchParams);
        if (!!range) {
            setRegionInput(range)
            setRegion({ value: range, label: range, type: "range" })
        }

        if (!!state) {
            setRegionInput(state)
            setRegion({ value: state, label: state, type: "state" })
        }

        if (!!country) {
            setRegionInput(country)
            setRegion({ value: country, label: country, type: "country" })
        }

        if (!!type) {
            setRegionInput(type)
            setRegion({ value: type, label: type, type: "type" })
        }

        if (!!search) {
            setRegionInput(search)
        }

        //return if start page - no load
        if (!!!isMain) {
            return
        }

        let _filter = !!filter ? parseIfNeccessary(filter) : null
        if (!!_filter) {
            filter = {
                ..._filter,
                ignore_filter: true,
            }
        } else {
            filter = {
                ignore_filter: true,
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
            map: searchParams.get("map"),
        })
    }, [
        searchParams && searchParams.get("city"),
        searchParams && searchParams.get("filter"),
        searchParams && searchParams.get("sort"),
        searchParams && searchParams.get("search"),
        searchParams && searchParams.get("type"),
        searchParams && searchParams.get("sort"),
        searchParams && searchParams.get("range"),
        searchParams && searchParams.get("map"),
        searchParams && searchParams.get("p"),
    ])

    const writeCityToLocalStorage = (city) => {
        localStorage.setItem("city", city)
    }

    // const changeTextMiddleware = (value, _function, _resetFunction) => {
    //     _function(value)
    //     _resetFunction(null)
    // }

    // const setCityInputMiddleware = (value) => {
    //     setCityInput(value)
    //     if (!!!value) {
    //         searchParams.delete("city")
    //         setSearchParams(searchParams)
    //         loadFavouriteTours({ sort: "relevanz", limit: 10, ranges: true })
    //     }
    // }

    // const onFocusCity = (value) => {
    //     setOpenCitySearch(!!value)
    // }
    // const onFocusRegion = (value) => {
    //     setOpenRegionSearch(!!value)
    // }

    const search = (tempRegion = null) => {
        let values = {}
        if (!!city && !!city.value) {
            values.city = city.value
        }

        let _region = region
        if (!!tempRegion) {
            _region = tempRegion
        }

        if (!!_region && !!_region.value) {
            values[_region.type] = _region.value
        } else if (!!regionInput) {
            values.search = regionInput
        }

        if (!!searchParams.get("sort")) {
            values.sort = searchParams.get("sort")
        } else {
            values.sort = "relevanz"
        }

        values.map = searchParams.get("map")
        values.provider = searchParams.get("p")

        searchParams.delete("filter")

        setOrRemoveSearchParam(searchParams, "city", values.city)
        setOrRemoveSearchParam(searchParams, "range", values.range)
        setOrRemoveSearchParam(searchParams, "state", values.state)
        setOrRemoveSearchParam(searchParams, "country", values.country)
        setOrRemoveSearchParam(searchParams, "type", values.type)
        setOrRemoveSearchParam(searchParams, "search", values.search)

        setSearchParams(searchParams)
        for (const entry of searchParams.entries()) {
            // console.log(entry);
        }
        // console.log("You are here, 195")
        if (!!goto) {
            navigate(goto + "?" + searchParams)
        } else {
            loadTours(values).then((res) => {
                window.scrollTo({ top: 0 })
            })
        }
    }

    const toggleFilter = () => {
        // code goes here for filter overlay
        console.log("Search.js toggleFilter() called")
        setActiveFilter(!activeFilter)
    }

    // const gotoHome = () => {
    //     let _city = searchParams.get("city")
    //     navigate(`/?${!!_city ? "city=" + _city : ""}`)
    // }

    const showCityModal = () => {
        showModal("MODAL_COMPONENT", {
            CustomComponent: FullScreenCityInput,
            searchParams,
            initialCity: cityInput,
            onSelect: (city) => {
                hideModal()
                if (!!city) {
                    setCityInput(city.label)
                    setCity(city)
                }
            },
            setSearchParams,
            title: "",
            modalSize: "lg",
            onBack: () => {
                hideModal()
            },
        })
    }

    const showRegionInput = () => {
        showModal("MODAL_COMPONENT", {
            CustomComponent: FullScreenRegionInput,
            searchParams,
            initialRegion: regionInput,
            onSelect: (region) => {
                hideModal()
                if (!!region) {
                    setRegionInput(region.value)
                    setRegion(region)
                    search(region)
                }
            },
            setSearchParams,
            title: "",
            modalSize: "lg",
            onBack: () => {
                hideModal()
            },
        })
    }

    // const onCustomRegionSubmit = () => {
    //     setOpenRegionSearch(false)
    //     search()
    // }

    // const resetRegionInput = () => {
    //     setRegionInput("")
    //     setRegion(null)
    //     setOpenRegionSearch(false)
    //     searchParams.delete("search")
    //     searchParams.delete("range")
    //     searchParams.delete("type")
    //     setSearchParams(searchParams)
    // }

    return (
        <Fragment>
            <Box>
                <Grid
                    container
                    display={"flex"}
                    justifyContent={"center"}
                    alignContent={"center"}
                    alignItems={"center"}
                >
                    <Grid item onClick={showRegionInput}>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <SearchIcon
                                style={{
                                    strokeWidth: 0.5,
                                    stroke: "#8B8B8B",
                                    fill: "#8B8B8B",
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs onClick={showRegionInput}>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <span
                                className={`search-bar--region__${
                                    regionInput ? "selection" : "default"
                                }`}
                            >
                                {regionInput
                                    ? regionInput
                                    : t("start.suche")}
                            </span>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box className={"search-bar--divider"} />
                    </Grid>
                    <Grid item xs onClick={showCityModal}>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <span className={"search-bar--city"}>
                                {cityInput.length > 0
                                    ? cityInput
                                    : t("start.heimatbahnhof")}
                            </span>
                        </Box>
                    </Grid>
                    <Grid item>
                        {!!initialIsMapView ? null : (
                            <Box>
                                {!!isMain ? (
                                    <IconButton
                                        onClick={toggleFilter}
                                        sx={
                                            activeFilter
                                                ? {
                                                      padding: "6px",
                                                      border: "2px solid",
                                                      borderColor: "#FF7663",
                                                      background: "#FF7663",
                                                      "&:hover": {
                                                          background: "#FF9885",
                                                      },
                                                  }
                                                : {
                                                      padding: "6px",
                                                      border: "2px solid",
                                                      borderColor: "#DDDDDD",
                                                      "&:hover": {
                                                          background: "#EEEEEE",
                                                      },
                                                  }
                                        }
                                    >
                                        <FilterIcon
                                            style={{
                                                transform: "scale(0.675)",
                                                stroke: activeFilter
                                                    ? "white"
                                                    : "#101010",
                                                strokeWidth: 1.25,
                                            }}
                                        />
                                    </IconButton>
                                ) : (
                                    <IconButton
                                        onClick={() => search()}
                                        sx={{
                                            "&:hover": {
                                                background: "#7aa8ff",
                                                fill: "#7aa8ff",
                                            },
                                        }}
                                    >
                                        <GoIcon
                                            style={{
                                                transform: "scale(1.55)",
                                                strokeWidth: 0,
                                            }}
                                        />
                                    </IconButton>
                                )}
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </Fragment>
    )
}

const mapDispatchToProps = {
    loadCities,
    loadRegions,
    loadTours,
    loadFavouriteTours,
    showModal,
    hideModal,
}

const mapStateToProps = (state) => {
    return {
        loading: state.tours.loading,
        cities: state.cities.cities,
        allCities: state.cities.all_cities,
        regions: state.regions.regions,
        isCityLoading: state.cities.loading,
        isRegionLoading: state.regions.loading,
    }
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(Search)

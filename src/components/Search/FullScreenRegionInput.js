import * as React from "react"
import Box from "@mui/material/Box"
import { useEffect, useState } from "react"
import { loadCities } from "../../actions/cityActions"
import { loadRegions } from "../../actions/regionActions"
import { loadFavouriteTours, loadTours } from "../../actions/tourActions"
import { loadRanges } from "../../actions/rangeActions"
import { hideModal, showModal } from "../../actions/modalActions"
import { compose } from "redux"
import { connect } from "react-redux"
import RegionInput from "./RegionInput"
import { RegionResultList } from "./RegionResultList"

function FullScreenRegionInput({
    initialRegion,
    onSelect,
    loadRegions,
    city,
    regions,
    searchParams,
    setSearchParams,
}) {
    const [regionInput, setRegionInput] = useState("")
    const [region, setRegion] = useState(null)
    const [openRegionSearch, setOpenRegionSearch] = useState(false)

    useEffect(() => {
        setRegionInput(initialRegion)
    }, [initialRegion])

    const changeTextMiddleware = (value, _function, _resetFunction) => {
        _function(value)
        _resetFunction(null)
    }

    const resetRegionInput = () => {
        setRegionInput("")
        setRegion(null)
        setOpenRegionSearch(false)
        searchParams.delete("search")
        searchParams.delete("range")
        searchParams.delete("type")
        setSearchParams(searchParams)
        onSelect(null)
    }

    return (
        <Box>
            <Box sx={{ padding: "20px" }}>
                {console.log("FSRI / regionInput :", regionInput) }
                {console.log("FSRI / city :", city) }
                <RegionInput
                    region={regionInput}
                    setRegion={(value) =>
                        changeTextMiddleware(value, setRegionInput, setRegion)
                    }
                    loadRegions={loadRegions}
                    city={city}
                    setOpenRegionSearch={setOpenRegionSearch}
                    resetInput={resetRegionInput}
                    searchParams={searchParams}
                />
            </Box>
            {/* <Box className={"result-container"}>
                <RegionResultList
                    regions={regions}
                    setRegion={setRegion}
                    setRegionInput={setRegionInput}
                    setOpenRegionSearch={setOpenRegionSearch}
                    regionInput={regionInput}
                    onSelect={onSelect}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />
            </Box> */}
        </Box>
    )
}

const mapDispatchToProps = {
    loadCities,
    loadRegions,
    loadTours,
    loadFavouriteTours,
    loadRanges,
    showModal,
    hideModal,
}

const mapStateToProps = (state) => {
    return {
        loading: state.tours.loading,
        cities: state.cities.cities,
        regions: state.regions.regions,
        isCityLoading: state.cities.loading,
        isRegionLoading: state.regions.loading,
    }
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(
    FullScreenRegionInput
)

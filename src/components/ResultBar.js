import * as React from 'react';
import Grid from "@mui/material/Grid";
import SortInput from "./SortInput";
import FilterButton from "./FilterButton";
import {useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import Filter from "./Filter/Filter";
import Box from "@mui/material/Box";
import {FormControlLabel, Typography} from "@mui/material";
import Switch from "@mui/material/Switch";
import {getFilterProp} from "../utils/globals";

export default function ResultBar({total, showModal, hideModal, filter, filterActive, everythingDisabled = false, clearTours}){

    // console.log("Total in ResultBar: " + total);
    const [searchParams, setSearchParams] = useSearchParams();
    const [order, setOrder] = React.useState("relevanz");
    const [mapView, setMapView] = React.useState(false);
    const [provider, setProvider] = React.useState("provider");

    useEffect(() => {
        let _order = searchParams.get('sort');
        let _mapView = searchParams.get('map');

        if(!!_mapView){
            setMapView(_mapView == "true");
        }
        if(!!_order){
            setOrder(_order);
        }

    }, [!!searchParams]);

    const openFilter = () => {
        showModal("MODAL_COMPONENT", {
            CustomComponent: Filter,
            title: "Filter",
            modalSize: "lg",
            doSubmit: handleFilterSubmit,
            resetFilter: handleResetFilter,
            searchParams,
            setSearchParams
        });
    }

    const handleFilterSubmit = ({filterValues}) => {
        hideModal();
        handleChange("filter", filterValues);
    }

    const handleResetFilter = () => {
        hideModal();
        handleChange("filter", null);
    }

    const handleChange = (queryType, entry) => {
        if(queryType == "order" && !!entry && !!entry.value){
            setOrder(entry.value);
            searchParams.set("sort", entry.value);
            setSearchParams(searchParams);

        } else if(queryType == "filter"){
            if(entry == null){
                searchParams.delete("filter");
            } else {
                searchParams.set("filter", JSON.stringify(entry));
            }
            setSearchParams(searchParams);
        } else if(queryType == "view"){
            searchParams.set("map", entry.value);
            setSearchParams(searchParams);
        }

    };


    return <div className={"result-bar"}>
        <div>
            <Grid container rowSpacing={0} columnSpacing={1}>
                <Grid item xs={12} sm={12} md={3} style={{alignSelf: "center", textAlign: "left"}} className={"result-text"}>
                    {Number(total).toLocaleString()} {total == 1 ? 'Ergebnis' : 'Ergebnisse'}
                </Grid>
                <Grid item xs={12} sm={12} md={9}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={2} sx={{textAlign: "left"}}>
                            <FormControlLabel control={<Switch
                                checked={!!mapView}
                                onChange={() => {
                                    handleChange('view', {value: !!!mapView})
                                    setMapView(!!!mapView)
                                }}
                            />} label="Karte" labelPlacement="end"/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <Box className={"filter-button-container"}>
                                <FilterButton openFilter={openFilter} filterActive={filterActive} />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Box className={"order-container cursor-link"} style={{display: "flex"}}>
                                <Typography style={{alignSelf: "center", paddingRight: "10px"}}>Sortieren nach</Typography>
                                <SortInput onChange={(value) => handleChange("order", value)} value={order} disabled={everythingDisabled}/>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>

    </div>
}

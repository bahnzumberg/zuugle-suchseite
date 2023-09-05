import * as React from 'react';
import Box from '@mui/material/Box';
import TourTimeLineContainer from "../../components/TimeLine/TourTimeLineContainer";
import {Typography} from "@mui/material";
import {Fragment, useEffect, useState} from "react";
import {loadTourConnectionsExtended} from "../../actions/tourActions";
import {compose} from "redux";
import {connect} from "react-redux";
import {useSearchParams} from "react-router-dom";
import moment from "moment";
import TourReturnTimeLineContainer from "../../components/TimeLine/TourReturnTimeLineContainer";
import {loadCities} from "../../actions/cityActions";
import FullScreenCityInput from "../../components/Search/FullScreenCityInput";
import {hideModal, showModal} from "../../actions/modalActions";
import SearchLight from "../../components/Search/SearchLight";

//description
//TourConnection is a React component that renders a timeline view of a tour's connections, and some functions (currently idle) that allow the user to select a city from which to start the tour.
export function TourConnection({tour, connectionEntity, currentIndex, setCurrentIndex, selectedReturnIndex, setSelectedReturnIndex, loadCities, showModal, hideModal, onCitySelected}){

    const [searchParams, setSearchParams] = useSearchParams();
    const [connectionLoading, setConnectionLoading] = useState(false);
    const [cityInput, setCityInput] = useState("");
    const [openCitySearch, setOpenCitySearch] = useState(false);

    useEffect(() => {
        const entry = getEntryFromIndex();
        if(!!entry && !!entry.date){
            searchParams.set("datum", moment(entry.date).format("YYYY-MM-DD"));
            setSearchParams(searchParams);
        }

    }, [currentIndex])


    const isConnectionAndCityEmpty = () => {
        const city = searchParams.get("city");
        return !!!city;
    }

    const getEntryFromIndex = (field = null) => {
        if(!!connectionEntity && connectionEntity.length > 0 && connectionEntity.length > currentIndex){
            const found = connectionEntity[currentIndex];
            if(!!field){
                return !!found ? found[field] : null;
            } else {
                return found;
            }
        }
        return null;
    }

    const getDateFromEntry = (entry) => {
        if(!!entry && !!entry.date){
            return moment(entry.date).format("DD.MM.YYYY");
        }
        return "Unbekannt"
    }

    const getPreviousFromIndex = () => {
        if((currentIndex-1) < 0){
            return null;
        }
        if(!!connectionEntity && connectionEntity.length > 0 && connectionEntity.length > (currentIndex-1)){
            const newValue = connectionEntity[currentIndex-1];
            return newValue;
        }
        return null;
    }

    const getNextFromIndex = () => {
        if(!!connectionEntity && connectionEntity.length > 0 && connectionEntity.length > (currentIndex+1)){
            let newValue = connectionEntity[currentIndex+1];
            return newValue;
        }
        return null;
    }

    const updateIndex = (toIndex) => {
        setConnectionLoading(true);
        setTimeout(() => {
            setCurrentIndex(toIndex);
            setSelectedReturnIndex(0);
            setConnectionLoading(false);
        }, 150)
    }

    const showCityModal = () => {
        showModal("MODAL_COMPONENT", {
            CustomComponent: FullScreenCityInput,
            searchParams,
            initialCity: cityInput,
            onSelect: (city) => {
                hideModal();
                /*if(!!city){
                    setCityInput(city.label);
                    setCity(city);
                }*/
            },
            setSearchParams,
            title: "",
            modalSize: "lg",
            onBack: () => {
                hideModal();
            }
        });
    }


    return <Box sx={{ width: '100%', padding: 0}}>
        {
            !!isConnectionAndCityEmpty() ? <Fragment>
                <Box sx={{padding: "20px"}}>
                    <Typography style={{marginBottom: "20px"}}>Bitte wähle jetzt den Ort aus, von dem du deine Tour starten willst. Meistens wird das deine Heimatstadt, oder der nächst-größere Ort sein. Erst dann können wir dir zeigen, welche Touren für dich erreichbar sind:</Typography>
                    <SearchLight tour={tour} onCitySelected={onCitySelected}/>
                </Box>
            </Fragment> : <Fragment>
                {/*  <Box sx={{width: '100%', height: '92px'}}>
                    <Box sx={{padding: '20px'}}>
                        <Grid container>
                            <Grid item xs={3} sx={{textAlign: 'left'}}>
                                {!!getPreviousFromIndex() &&
                                <Button variant="text" onClick={() => updateIndex(currentIndex-1)}><KeyboardArrowLeft /> {getDateFromEntry(getPreviousFromIndex())}</Button>
                                }
                            </Grid>
                            <Grid item xs={6} sx={{textAlign: 'center'}}>
                                <Typography xs={{fontSize: '14px', fontWeight: 600}} style={{fontWeight: 600}}>An- & Abreise</Typography>
                                <Typography xs={{fontSize: '14px'}}>{getDateFromEntry(getEntryFromIndex())}</Typography>
                            </Grid>
                            <Grid item xs={3} sx={{textAlign: 'right'}}>
                                {!!getNextFromIndex() &&
                                <Button variant="text" onClick={() => {
                                    updateIndex(currentIndex+1)
                                }}>{getDateFromEntry(getNextFromIndex())} <KeyboardArrowRight /></Button>
                                }
                            </Grid>
                        </Grid>
                    </Box>
                </Box> */}
                <Box sx={{padding: '20px', bgcolor: 'info.main' }} className={"timeline-outer-container"}>
                    <TourTimeLineContainer connections={getEntryFromIndex()} loading={connectionLoading}/>
                    <Box sx={{height: "20px"}}></Box>
                    <TourReturnTimeLineContainer connections={getEntryFromIndex()} loading={connectionLoading} date={getDateFromEntry(getEntryFromIndex())} selectedIndex={selectedReturnIndex} setSelectedIndex={setSelectedReturnIndex}/>
                </Box>

            </Fragment>
        }
    </Box>
}


const mapDispatchToProps = {
    loadTourConnectionsExtended,
    loadCities,
    showModal,
    hideModal
};


const mapStateToProps = (state) => {
    return {

    }
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
)(TourConnection)

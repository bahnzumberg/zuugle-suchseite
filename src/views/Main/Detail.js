import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TourDetails from "./TourDetails";
import TourConnection from "./TourConnection";
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import moment from "moment";
import ArrowLeft from "../../icons/ArrowLeft";
import Grid from "@mui/material/Grid";
import {Button} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight} from "@mui/icons-material";
import { useTranslation } from 'react-i18next';

//description:
// The TabPanel function is a helper function that returns a React component that displays the content of a single tab panel within the Detail component (currently: 'TOURDETAILS' & 'AN- & ABREISE'). It takes in a set of props, including children, value, and index, and returns a div element that shows the content only if the value of the TabPanel matches the current selected tab value (value === index).
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 0 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
//description:
//The id property is used as the id attribute of the corresponding tab panel. This is required for accessibility, as it allows screen readers to associate each tab with its corresponding content.
//The aria-controls property is used as the aria-controls attribute of the corresponding tab button. This attribute is used to identify the tab panel that the tab button controls, and is also required for accessibility.
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Detail({tour, loadTourConnectionsExtended, onClose}){

    const{t} = useTranslation();
    const tabLabelTourDetails = t('main.tourdetails');
    const tabLabelArrivalDeparture = t('main.an_und_abreise');

    const departureLabel = t('main.anreisetag')
    // console.log("tour value: ",tour)
    const [value, setValue] = React.useState(0);
    const [connectionEntity, setConnectionEntity] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedReturnIndex, setSelectedReturnIndex] = useState(0);

    useEffect(() => {
        const city = searchParams.get("city");
        //description:
        //given the tour id and the city to depart from, this function will fetch related tour connections from the dbase and set the state
        loadTourConnectionsExtended({id: tour.id, city: city}).then(res => {
            if(!!res && !!res.data){
                //clg
                //res.data.result is :
                // console.log("res.data.result L58 :",res.data.result) // an array of objects: each is {conections{}, returns{}, date}
                setConnectionEntity(res.data.result);
            }
        })
        const _date = searchParams.get("datum");
        if(!!!_date){
            // description
            // in case date is not set inside the searchParams, format the current date using moment.js library and set the datum parameter in the search params with this value.
            searchParams.set("datum", moment().format("YYYY-MM-DD"));
            setSearchParams(searchParams);
        } else {
            // description
            // else means the datum parameter is present, now search for the connectionEntity with a matching date using the findIndex method. If a matching entity is found, it sets the current index to the index of the matching entity using setCurrentIndex. If no matching entity is found, it sets the current index to 0.
            if(!!connectionEntity && connectionEntity.length > 0){
                const found = connectionEntity.findIndex(entity => moment(entity.date).format("YYYY-MM-DD") == moment(_date).format("YYYY-MM-DD"));
                setCurrentIndex(!!found ? found : 0);
            }
        }
    }, [!!tour && !!searchParams && !!connectionEntity])

    const onCitySelected = (city) => {
        if(!!city && !!city.value && !!tour){
            loadTourConnectionsExtended({id: tour.id, city: city.value}).then(res => {
                if(!!res && !!res.data){
                    setConnectionEntity(res.data.result);
                }
            })
        }
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getConnectionFromIndex = () => {
        if(!!connectionEntity && connectionEntity.length > currentIndex){
            let entry = connectionEntity[currentIndex];
            if(!!entry && entry.connections && entry.connections.length > 0){
                return entry.connections[0];
            }
        }
        //clg
        // console.log("L93 : RETURN A NULL inside fcn 'getConnectionFromIndex' ")
        return null;
    }

    const getReturnFromIndex = () => {
        if(!!connectionEntity && connectionEntity.length > currentIndex){
            let entry = connectionEntity[currentIndex];
            if(!!entry && entry.returns && entry.returns.length > selectedReturnIndex){
                return entry.returns[selectedReturnIndex];
            }
        }
        return null;
    }

    const getReturnsFromIndex = () => {
        if(!!connectionEntity && connectionEntity.length > currentIndex){
            let entry = connectionEntity[currentIndex];
            return entry.returns;
        }
        return null;
    }

    const addStyleValues = (forIndex) => {
        if(forIndex == value){
            return {
                background: "white", border: "2px solid #EAEAEA", borderRadius: "16px"
            }
        }
        return {};
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
        //setConnectionLoading(true);
        setTimeout(() => {
            setCurrentIndex(toIndex);
            setSelectedReturnIndex(0);
            //setConnectionLoading(false);
        }, 150)
    }

    return <Box sx={{ width: '100%', padding: 0, backgroundColor: "#ffffff"}}>
        {/* Row 1: Anreisetag  */}
        <Box sx={{width: '100%', height: '70px', borderBottom: "1px solid rgba(0,0,0,0.05)"}}>
            <Box sx={{padding: '15px'}}>
                <Grid container>
                    <Grid item xs={3} sx={{textAlign: 'left'}}>
                        {!!getPreviousFromIndex() &&
                        <Button variant="text" onClick={() => updateIndex(currentIndex-1)}><KeyboardArrowLeft /> {getDateFromEntry(getPreviousFromIndex())}</Button>
                        }
                    </Grid>
                    <Grid item xs={6} sx={{textAlign: 'center'}}>
                        <Typography xs={{fontSize: '14px', fontWeight: 600}} style={{fontWeight: 600}}>{departureLabel}</Typography>
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
        </Box>
        {/* Row 2: (Arrow Left) , TOURDETAILS & (An- & Abreise) */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: "flex", flexDirection: "row" }}>
            <Box onClick={onClose} className={"cursor-link"} sx={{width: "35px", height: "35px", border: "1px solid #EAEAEA", borderRadius: "12px", marginLeft: "10px", alignSelf: "center"}}>
                <Box sx={{padding: "5px"}}>
                    <ArrowLeft style={{stroke: "#000000", fill: "none", strokeWidth: 1}}/>
                </Box>
            </Box>
            {/* description:
            When a user clicks on a tab, the onChange function is called with the index of the clicked tab, and this index is then passed as the value prop to the Tabs component. The Tabs component then sets the aria-selected attribute of the selected tab to true and the tabIndex attribute of the selected tab to 0. It also sets the aria-selected attribute of all other tabs to false and their tabIndex attribute to -1.
            the aria-selected and tabIndex attributes are not set explicitly in the code. The Tabs component from @mui/material library handles setting these attributes automatically based on the value and onChange props that are passed to it.
            So, in summary, the a11yProps function in the code sets the id and aria-controls attributes of each Tab component, while the Tabs component handles setting the aria-selected and tabIndex attributes based on the value and onChange props that are passed to it. */}
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" style={{marginLeft: "10px"}}>
                <Tab label={tabLabelTourDetails} {...a11yProps(0)} style={{paddingLeft: "25px", paddingRight: "25px", color: "#101010", minHeight: 0, height: "35px", alignSelf: "center", ...addStyleValues(0)}}/>
                {/* <Tab label="Tourdetails" {...a11yProps(0)} style={{paddingLeft: "25px", paddingRight: "25px", color: "#101010", minHeight: 0, height: "35px", alignSelf: "center", ...addStyleValues(0)}}/> */}
                <Tab label={tabLabelArrivalDeparture} {...a11yProps(1)} style={{paddingLeft: "25px", paddingRight: "25px", color: "#101010",minHeight: 0, height: "35px", alignSelf: "center", ...addStyleValues(1)}}/>
            </Tabs>
        </Box>
        {/* Row 3: TourDetails or TourConnection components*/}
        <TabPanel value={value} index={0}>
            <TourDetails tour={tour} connection={getConnectionFromIndex()} returnConnection={getReturnFromIndex()} handleTabChange={handleChange} returnConnections={getReturnsFromIndex()}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
            <TourConnection tour={tour} connectionEntity={connectionEntity} setCurrentIndex={setCurrentIndex} currentIndex={currentIndex} selectedReturnIndex={selectedReturnIndex} setSelectedReturnIndex={setSelectedReturnIndex} onCitySelected={onCitySelected}/>
        </TabPanel>
    </Box>
}

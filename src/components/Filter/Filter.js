import * as React from 'react';
import Box from '@mui/material/Box';
import {Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import DifficultySlider from "../DifficultySlider";
import GeneralSlider from "../GeneralSlider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Intensity from "../../icons/Intensity";
import NumberInput from "../NumberInput";
import Button from "@mui/material/Button";
import {Fragment, useEffect, useState} from "react";
import TextWithIcon from "../TextWithIcon";
import {convertNumToTime, getFilterProp} from "../../utils/globals";
import CircularProgress from "@mui/material/CircularProgress";
import {loadFilter, loadTourConnections, loadTourConnectionsExtended, loadTours} from "../../actions/tourActions";
import {loadAllCities} from "../../actions/cityActions";
import {hideModal, showModal} from "../../actions/modalActions";
import {compose} from "redux";
import {connect} from "react-redux";
import TextInput from "../TextInput";

function Filter({filter, doSubmit, resetFilter, searchParams, loadFilter, isLoadingFilter}){

    useEffect(() => {
        let city = searchParams.get('city');
        let range = searchParams.get('range');
        let state = searchParams.get('state');
        let country = searchParams.get('country');
        let type = searchParams.get('type');
        let search = searchParams.get('search');
        let provider = searchParams.get('p');

        loadFilter({
            city: city,
            range: range,
            state: state,
            country: country,
            type: type,
            search: search,
            provider: provider,
        });
    }, [])

    useEffect(() => {
        if(!!filter){
            //setAscent(getFilterProp(filter, "maxAscent", 5000));
            //setDescent(getFilterProp(filter, "maxDescent", 5000));

            setMinAscent(getFilterProp(filter, "minAscent", 0));
            setMaxAscent(getFilterProp(filter, "maxAscent", 10000));

            setMinDescent(getFilterProp(filter, "minDescent", 0));
            setMaxDescent(getFilterProp(filter, "maxDescent", 10000));

            setMinDistance(getFilterProp(filter, "minDistance", 0));
            setMaxDistance(getFilterProp(filter,"maxDistance", 10000));

            setMinTransportDuration(getFilterProp(filter, "minTransportDuration", 0));
            setMaxTransportDuration(getFilterProp(filter, "maxTransportDuration", 50));

            if(!!filter.ranges){
                setRangeValues(filter.ranges.map(e => {
                    return {
                        value: e,
                        checked: true
                    }
                }));
            }
            if(!!filter.types){
                setTypeValues(filter.types.map(e => {
                    return {
                        value: e,
                        checked: true
                    }
                }));
            }


            let _filter = searchParams.get('filter');
            if(!!_filter){
                try {
                    const parsed = JSON.parse(_filter);
                    if(!!parsed){
                        setIfNotUndefined(parsed, "singleDayTour", setSingleDayTour);
                        setIfNotUndefined(parsed, "multipleDayTour", setMultipleDayTour );
                        setIfNotUndefined(parsed, "summerSeason", setSummerSeason);
                        setIfNotUndefined(parsed, "winterSeason", setWinterSeason);
                        setIfNotUndefined(parsed, "difficulty", setDifficulty);
                        setIfNotUndefined(parsed, "minAscent", setMinAscent);
                        setIfNotUndefined(parsed, "maxAscent", setMaxAscent);
                        setIfNotUndefined(parsed, "minDescent", setMinDescent);
                        setIfNotUndefined(parsed, "maxDescent", setMaxDescent);
                        setIfNotUndefined(parsed, "minTransportDuration", setMinTransportDuration);
                        setIfNotUndefined(parsed, "maxTransportDuration", setMaxTransportDuration);
                        setIfNotUndefined(parsed, "minDistance", setMinDistance);
                        setIfNotUndefined(parsed, "maxDistance", setMaxDistance);
                        setIfNotUndefined(parsed, "children", setChildren);
                        setIfNotUndefined(parsed, "traverse", setTravers);

                        if(!!filter && !!filter.ranges && !!parsed.ranges){
                            setRangeValues(filter.ranges.map(entry => {
                                const found = parsed.ranges.find(e => e == entry);
                                return {
                                    value: entry,
                                    checked: !!found ? true : false
                                }
                            }))
                        }
                        if(!!filter && !!filter.types && !!parsed.types){
                            setTypeValues(filter.types.map(entry => {
                                const found = parsed.types.find(e => e == entry);
                                return {
                                    value: entry,
                                    checked: !!found ? true : false
                                }
                            }))
                        }
                    }
                } catch(e){
                    console.error(e);
                }
            }

        }
    }, [filter]);

    const countFilterActive = () => {
        let count = 0;
        if(!(!!singleDayTour && !!multipleDayTour)){
            count++;
        }
        if(!(!!summerSeason && !!winterSeason)){
            count++;
        }
        if(difficulty != 10){
            count++;
        }
        if(!!children){
            count++;
        }
        if(!!traverse){
            count++;
        }
        if(minAscent != getFilterProp(filter, "minAscent") || maxAscent != getFilterProp(filter, "maxAscent")){
            count++;
        }
        if(minDescent != getFilterProp(filter, "minDescent") || maxDescent != getFilterProp(filter, "maxDescent")){
            count++;
        }
        if(minTransportDuration != getFilterProp(filter, "minTransportDuration") || maxTransportDuration != getFilterProp(filter, "maxTransportDuration")){
            count++;
        }
        if(minDistance != getFilterProp(filter, "minDistance") || maxDistance != getFilterProp(filter, "maxDistance")){
            count++;
        }
        if(rangeValues.filter(rv => !!!rv.checked).length > 0){
            count++;
        }
        if(typeValues.filter(rv => !!!rv.checked).length > 0){
            count++;
        }
        return count;
    }


    const setIfNotUndefined = (object, key, _function) => {
        if(!!object){
            if(object[key] !== undefined){
                _function(object[key]);
            }
        }
    }

    const [singleDayTour, setSingleDayTour] = useState(true);
    const [multipleDayTour, setMultipleDayTour] = useState(true);
    const [summerSeason, setSummerSeason] = useState(true);
    const [winterSeason, setWinterSeason] = useState(true);
    const [difficulty, setDifficulty] = useState(10);
    const [minAscent, setMinAscent] = useState(0);
    const [maxAscent, setMaxAscent] = useState(10000);
    const [minDescent, setMinDescent] = useState(0);
    const [maxDescent, setMaxDescent] = useState(10000);

    const [minTransportDuration, setMinTransportDuration] = useState(0);
    const [maxTransportDuration, setMaxTransportDuration] = useState(10000);

    const [minDistance, setMinDistance] = useState(0);
    const [maxDistance, setMaxDistance] = useState(10000);
    const [children, setChildren] = useState(false);
    const [traverse, setTravers] = useState(false);

    const [rangeValues, setRangeValues] = useState([]);
    const [typeValues, setTypeValues] = useState([]);

    const [rangeValuesState, setRangeValuesState] = useState(true);
    const [typeValuesState, setTypeValuesState] = useState(true);

    const submit = () => {
        const filterValues = {
            singleDayTour: mapPosNegValues(singleDayTour),
            multipleDayTour: mapPosNegValues(multipleDayTour),
            summerSeason: mapPosNegValues(summerSeason),
            winterSeason: mapPosNegValues(winterSeason),
            children: mapPosNegValues(children),
            traverse: mapPosNegValues(traverse),
            difficulty: difficulty,
            minAscent: minAscent,
            maxAscent: maxAscent,
            minDescent: minDescent,
            maxDescent: maxDescent,
            minTransportDuration: minTransportDuration,
            maxTransportDuration: maxTransportDuration,
            minDistance: minDistance,
            maxDistance: maxDistance,
            ranges: rangeValues.filter(e => !!e.checked).map(e => e.value),
            types: typeValues.filter(e => !!e.checked).map(e => e.value),
        }
        doSubmit({filterValues: filterValues, filterCount: countFilterActive()});
    }

    const checkIfCheckedFromCheckbox = (list, key) => {
        return !!(!!list ? list: []).find(l => l.value == key && !!l.checked);
    }

    const onChangedCheckbox = (list, key, value, _function) => {
        _function((!!list ? list: []).map(entry => {
            let toPush = {...entry};
            if(entry.value == key){
                toPush.checked = value;
            }
            return toPush;
        }));
    }

    const mapPosNegValues = (value) => {
        if(!!value){
            return value;
        }
        return false;
    }

    const getTypes = () => {
        let types = [];
        if(!!filter && !!filter.types){
            types = filter.types.map(entry => {
                return {
                    value: entry,
                    label: entry
                }
            })
        }
        return types.map((type,index) => {
            return  <Grid key={index} item xs={6}>
                        <Box>
                            <FormControlLabel control={<Checkbox checked={checkIfCheckedFromCheckbox(typeValues, type.value)} onChange={({target}) => {onChangedCheckbox(typeValues, type.value, target.checked, setTypeValues)}}/>} label={type.label} />
                        </Box>
                    </Grid>
            });
    }

    const getRanges = () => {
        let ranges = [];
        if(!!filter && !!filter.ranges){
            ranges = filter.ranges.map(entry => {
                return {
                    value: entry,
                    label: entry
                }
            })
        }

        return ranges.map((type,index) => {
            return  <Grid key={index} item xs={6}>
                <Box>
                    <FormControlLabel control={<Checkbox checked={checkIfCheckedFromCheckbox(rangeValues, type.value)} onChange={({target}) => {onChangedCheckbox(rangeValues, type.value, target.checked, setRangeValues)}}/>} label={type.label} />
                </Box>
            </Grid>
        });
    }

    const updateAllRangeValues = () => {
        setRangeValues(rangeValues.map(rv => { return {...rv, checked: !!!rangeValuesState} }));
        setRangeValuesState(!!!rangeValuesState);
    }

    const updateAllTypeValues = () => {
        setTypeValues(typeValues.map(rv => { return {...rv, checked: !!!typeValuesState} }));
        setTypeValuesState(!!!typeValuesState);
    }

    return <Box style={{height: "100%"}}>

        {!!isLoadingFilter ?
            <Box style={{maxWidth: "100%", textAlign: "center", padding: "20px", width: "500px"}}>
                <CircularProgress />
            </Box> :

            <Fragment>
                <Box className={"filter-box-container"}>


                    <Box className={"filter-box border"}>
                        <Typography variant={"subtitle1"}>Tourlänge</Typography>
                        <Grid container>
                            <Grid item xs={6} sx={{borderRight: "1px solid #EAEAEA", paddingRight: "24px"}}  className={"toggle-container-left"}>
                                <Grid container spacing={0}>
                                    <Grid item xs={6} sx={{alignSelf: "center"}}>
                                        <Typography variant={"subtitle3"}>Tagestour</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{textAlign: "right"}}>
                                        <Switch
                                            checked={singleDayTour}
                                            onChange={() => setSingleDayTour(!!!singleDayTour)}
                                            disabled={!!!getFilterProp(filter, "isSingleDayTourPossible")}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} sx={{paddingLeft: "24px"}} className={"toggle-container-right"}>
                                <Grid container spacing={0}>
                                    <Grid item xs={6} sx={{alignSelf: "center"}}>
                                        <Typography variant={"subtitle3"}>Mehrtagestour</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{textAlign: "right"}}>
                                        <Switch
                                            checked={multipleDayTour}
                                            onChange={() => setMultipleDayTour(!!!multipleDayTour)}
                                            disabled={!!!getFilterProp(filter, "isMultipleDayTourPossible")}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box className={"filter-box border"} style={{paddingTop: "20px", paddingBottom: "20px"}}>
                        <Typography variant={"subtitle1"}>Jahreszeit</Typography>
                        <Grid container>
                            <Grid item xs={6} sx={{borderRight: "1px solid #EAEAEA", paddingRight: "24px"}} className={"toggle-container-left"}>
                                <Grid container spacing={0}>
                                    <Grid item xs={6} sx={{alignSelf: "center"}}>
                                        <Typography>Sommertour</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{textAlign: "right"}}>
                                        <Switch
                                            checked={summerSeason}
                                            onChange={() => setSummerSeason(!!!summerSeason)}
                                            disabled={!!!getFilterProp(filter, "isSummerTourPossible")}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} sx={{paddingLeft: "24px"}}  className={"toggle-container-right"}>
                                <Grid container spacing={0}>
                                    <Grid item xs={6} sx={{alignSelf: "center"}}>
                                        <Typography>Wintertour</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{textAlign: "right"}}>
                                        <Switch
                                            checked={winterSeason}
                                            onChange={() => setWinterSeason(!!!winterSeason)}
                                            disabled={!!!getFilterProp(filter, "isWinterTourPossible")}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box className={"filter-box"} sx={{paddingTop: "20px"}}>
                        <Box sx={{paddingTop: "16px"}}>
                            <Grid container sx={{paddingTop: "16px"}}>
                                <Grid item xs={10}>
                                    <Typography variant={"subtitle1"}>Nur Überschreitungen</Typography>
                                    <Typography variant={"subtitle2"} sx={{fontSize: "16px", fontWeight: 400}}>Tourstart und Tourende sind unterschiedliche Haltestellen.</Typography>
                                </Grid>
                                <Grid item xs={2} sx={{textAlign: "right"}}>
                                    <Switch
                                        checked={traverse}
                                        onChange={() => setTravers(!!!traverse)}
                                        disabled={!!!getFilterProp(filter, "isTraversePossible")}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Box className={"filter-box border"} sx={{paddingTop: "20px"}}>
                        <Grid container>
                            <Grid item xs={6} sx={{borderRight: "1px solid #EAEAEA", paddingRight: "24px"}}  className={"toggle-container-left"}>
                                <Typography>Anstieg (hm)</Typography>
                                <GeneralSlider
                                    containerSx={{marginRight: '10px'}}
                                    step={100}
                                    min={getFilterProp(filter, "minAscent", 0)}
                                    max={getFilterProp(filter, "maxAscent", 5000)}
                                    value={[minAscent, maxAscent]}
                                    onChange={({target}) => {
                                        setMinAscent(target.value[0])
                                        setMaxAscent(target.value[1])
                                    }}
                                />

                                <Box sx={{marginTop: "15px"}}>
                                    <Grid container spacing={"10px"}>
                                        <Grid item xs={6}>
                                            <NumberInput
                                                id="outlined-basic"
                                                label="Minimum"
                                                variant="filled"
                                                value={minAscent}
                                                endAdormentLabel={null}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <NumberInput
                                                id="outlined-basic"
                                                label="Maximum"
                                                variant="filled"
                                                endAdormentLabel={null}
                                                value={maxAscent}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                                {maxAscent === 3000 && <div style={{fontSize: "12px", width: "100%", textAlign: "right", paddingTop: "5px", color: "#8B8B8B"}}>3000+ Höhenmeter</div>}
                            </Grid>
                            <Grid item xs={6} sx={{paddingLeft: "24px"}}  className={"toggle-container-right"}>
                                <Typography>Abstieg (hm)</Typography>
                                <GeneralSlider
                                    containerSx={{marginRight: '10px'}}
                                    step={100}
                                    min={getFilterProp(filter, "minDescent", 0)}
                                    max={getFilterProp(filter, "maxDescent", 5000)}
                                    value={[minDescent, maxDescent]}
                                    onChange={({target}) => {
                                        setMinDescent(target.value[0])
                                        setMaxDescent(target.value[1])
                                    }}
                                />
                                <Box sx={{marginTop: "15px"}}>
                                    <Grid container spacing={"10px"}>
                                        <Grid item xs={6}>
                                            <NumberInput
                                                id="outlined-basic"
                                                label="Minimum"
                                                variant="filled"
                                                endAdormentLabel={null}
                                                value={minDescent}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <NumberInput
                                                id="outlined-basic"
                                                label="Maximum"
                                                variant="filled"
                                                endAdormentLabel={null}
                                                value={maxDescent}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                                {maxDescent === 3000 && <div style={{fontSize: "12px", width: "100%", textAlign: "right", paddingTop: "5px", color: "#8B8B8B"}}>3000+ Höhenmeter</div>}
                            </Grid>
                        </Grid>
                    </Box>
                    <Box className={"filter-box border"} sx={{paddingTop: "20px"}}>
                        <Grid container>
                            <Grid item xs={6} sx={{borderRight: "1px solid #EAEAEA",paddingRight: "24px"}} className={"toggle-container-left"}>
                                <Typography>Anfahrtszeit (h)</Typography>
                                <GeneralSlider
                                    containerSx={{marginRight: '10px'}}
                                    step={0.50}
                                    min={getFilterProp(filter, "minTransportDuration", 0)}
                                    max={getFilterProp(filter, "maxTransportDuration", 50)}
                                    value={[minTransportDuration, maxTransportDuration]}
                                    onChange={({target}) => {
                                        setMinTransportDuration(target.value[0])
                                        setMaxTransportDuration(target.value[1])
                                    }}
                                />

                                <Box sx={{marginTop: "15px"}}>
                                    <Grid container spacing={"10px"}>
                                        <Grid item xs={6}>
                                            <TextInput
                                                id="outlined-basic"
                                                label="Minimum"
                                                variant="filled"
                                                endAdormentLabel={null}
                                                value={convertNumToTime(minTransportDuration)}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextInput
                                                id="outlined-basic"
                                                label="Maximum"
                                                variant="filled"
                                                endAdormentLabel={null}
                                                value={convertNumToTime(maxTransportDuration)}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sx={{paddingLeft: "24px"}}  className={"toggle-container-right"}>
                                <Typography>Gehdistanz (km)</Typography>
                                <GeneralSlider
                                    containerSx={{marginRight: '10px'}}
                                    step={2}
                                    min={getFilterProp(filter, "minDistance", 0)}
                                    max={getFilterProp(filter, "maxDistance", 10000)}
                                    value={[minDistance, maxDistance]}
                                    onChange={({target}) => {
                                        setMinDistance(target.value[0])
                                        setMaxDistance(target.value[1])
                                    }}
                                />
                                <Box sx={{marginTop: "15px"}}>
                                    <Grid container spacing={"10px"}>
                                        <Grid item xs={6}>
                                            <NumberInput
                                                id="outlined-basic"
                                                label="Minimum"
                                                variant="filled"
                                                endAdormentLabel={null}
                                                value={minDistance}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <NumberInput
                                                id="outlined-basic"
                                                label="Maximum"
                                                variant="filled"
                                                endAdormentLabel={null}
                                                value={maxDistance}
                                            />
                                            {maxDistance === 80 && <div style={{fontSize: "12px", width: "100%", textAlign: "left", paddingTop: "5px", color: "#8B8B8B"}}>80+ km</div>}
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box className={"filter-box border"} sx={{paddingTop: "20px"}}>
                        <Typography variant={"subtitle1"}>Sportart <Typography variant={"text"} className={"cursor-link"} sx={{fontSize: "14px"}} onClick={updateAllTypeValues}>Alle ab-/anwählen</Typography></Typography>
                        <Grid container sx={{paddingTop: "16px"}}>
                            {getTypes()}
                        </Grid>
                    </Box>
                    <Box className={"filter-box border"} sx={{paddingTop: "20px"}}>
                        <Typography variant={"subtitle1"}>Regionen <Typography variant={"text"} className={"cursor-link"} sx={{fontSize: "14px"}} onClick={updateAllRangeValues}>Alle ab-/anwählen</Typography></Typography>
                        <Grid container sx={{paddingTop: "16px"}}>
                            {getRanges()}
                        </Grid>
                    </Box>
                    <Box className={"filter-box border"} sx={{paddingTop: "20px", position: "relative"}}>
                        <Box sx={{position: "absolute", top: '20px', right: '20px'}}>
                            <Typography variant={"error"}><TextWithIcon text={difficulty} iconRight={<Intensity style={{stroke: "#FF540B", fill: "none", strokeWidth: 1.5}}/>} /></Typography>
                        </Box>
                        <Typography variant={"subtitle1"}>Schwierigkeit</Typography>
                        <Typography variant={"subtitle2"} sx={{fontSize: "14px", fontWeight: 400}}>Der Schwierigkeitswert wurde nach den allgemein verfügbaren Schwierigkeitsskalen auf den diversen Tourenportalen konsolidiert und kann zwischen 1 (leicht) bis 10 (sehr schwierig) variieren.</Typography>
                        <DifficultySlider
                            containerSx={{marginTop: '20px', marginRight: '10px'}}
                            defaultValue={10}
                            value={difficulty}
                            onChange={({target}) => setDifficulty(target.value)}
                        />
                    </Box>
                    <Box className={"filter-box"} sx={{paddingTop: "20px"}}>
                        <Typography variant={"subtitle1"}>Weitere Filter</Typography>
                        <Box sx={{paddingTop: "16px"}}>
                            <Grid container>
                                <Grid item xs={10}>
                                    <Typography variant={"subtitle3"}>Kinderfreundlich</Typography>
                                    <Typography variant={"subtitle2"} sx={{fontSize: "16px", fontWeight: 400}}>Der Autor hat diese Tour aus seiner persönlichen Sicht als kinderfreundlich bewertet. Bitte die Tour jedenfalls selbst bewerten und dem Alter und Können der Kinder entsprechend wählen.</Typography>
                                </Grid>
                                <Grid item xs={2} sx={{textAlign: "right"}}>
                                    <Switch
                                        checked={children}
                                        onChange={() => setChildren(!!!children)}
                                        disabled={!!!getFilterProp(filter, "isChildrenPossible")}
                                    />
                                </Grid>
                            </Grid>
                            
                        </Box>
                    </Box>
                </Box>
                <Box className={"filter-box bottom"}  sx={{marginBottom: "40px", borderTop: "1px solid #EAEAEA", padding: 0}}>
                    <Box sx={{float: "right", padding: "20px"}}>
                        <Button variant={"text"} sx={{marginRight: "15px", color: "#8B8B8B"}} onClick={resetFilter}>Filter löschen</Button>
                        <Button variant={"contained"} onClick={submit}>{countFilterActive()} Filter anwenden</Button>
                    </Box>
                </Box>
            </Fragment>
        }



    </Box>
};

const mapDispatchToProps = {
    loadTours,
    loadAllCities,
    showModal,
    hideModal,
    loadTourConnections,
    loadTourConnectionsExtended,
    loadFilter
};


const mapStateToProps = (state) => {
    return {
        filter: state.tours.filter,
        isLoadingFilter: state.tours.isLoadingFilter,
    }
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
)(Filter)
import * as React from 'react';
import {Fragment, useState} from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import ChevronRightLight from "../../icons/ChevronRight";

export function RegionResultList({regions, setRegion, setRegionInput, onFocusRegion, setOpenRegionSearch, regionInput, onSelect, search}){

    const [sliceRanges, setSliceRanges] = useState(true);
    const [sliceTypes, setSliceTypes] = useState(true);

    let _ranges = (!!regions && !!regions.ranges && regions.ranges.length > 5 && !!sliceRanges) ? regions.ranges.slice(0, 5) : (!!regions ? regions.ranges : []);
    let _types = (!!regions && !!regions.types && regions.types.length > 5 && !!sliceTypes) ? regions.types.slice(0, 5) : (!!regions ? regions.types : []);

    return  <List>
        {
            (!!_ranges && _ranges.length > 0) &&
            <ListItem sx={{backgroundColor: "#F4F4F4"}}>
                <ListItemText
                    secondary={"REGIONEN"}
                />
            </ListItem>
        }

        {(!!_ranges) ? _ranges.map((_region,index) => {
            return <ListItem
                key={index}
                onMouseDown={(event) => {
                    setRegion(_region);
                    setRegionInput(_region.label)
                    if(!!onFocusRegion){
                        onFocusRegion(false)
                    }
                    if(!!onSelect){
                        onSelect(_region);
                    }
                    if(!!search){
                        search(_region)
                    }
                }}
                sx={{borderBottom: "1px solid #ECECEC", paddingLeft: "20px", cursor: "pointer"}}
                secondaryAction={
                    <IconButton edge="end" aria-label="go">
                        <ChevronRightLight />
                    </IconButton>
                }>
                <ListItemText
                    primary={_region.label}
                />
            </ListItem>
        }) : []}

        {
            (!!regions.ranges && regions.ranges.length > 5 && !!sliceRanges) && <ListItem
                sx={{borderBottom: "1px solid #ECECEC", paddingLeft: "20px", cursor: "pointer"}}
            >
                <ListItemText
                    onMouseDown={() => {
                        setSliceRanges(false);
                        setTimeout(() => {
                            setOpenRegionSearch(true);
                        }, 10)
                    }}
                    color={"#4992FF"}
                    secondary={`${regions.ranges.length - 5} weitere einblenden`}
                    secondaryTypographyProps={{
                        color: '#4992FF',
                    }}
                />
            </ListItem>
        }

        {
            (!!_types && _types.length > 0) &&  <ListItem sx={{backgroundColor: "#F4F4F4"}}>
                <ListItemText
                    secondary={"SPORTARTEN"}
                />
            </ListItem>
        }


        {(_types) ? _types.map((_region,index) => {
            return <ListItem
                key={index}
                onMouseDown={(event) => {
                    setRegion(_region);
                    setRegionInput(_region.label)
                    if(!!onFocusRegion){
                        onFocusRegion(false)
                    }
                    if(!!onSelect){
                        onSelect(_region);
                    }
                    if(!!search){
                        search(_region)
                    }
                }}
                sx={{borderBottom: "1px solid #ECECEC", paddingLeft: "20px", cursor: "pointer"}}
                secondaryAction={
                    <IconButton edge="end" aria-label="go">
                        <ChevronRightLight />
                    </IconButton>
                }>
                <ListItemText
                    primary={_region.label}
                />
            </ListItem>
        }) : []}

        {
            (!!regions.types && regions.types.length > 5 && !!sliceTypes) && <ListItem
                sx={{borderBottom: "1px solid #ECECEC", paddingLeft: "20px", cursor: "pointer"}}
            >
                <ListItemText
                    onMouseDown={() => {
                        setSliceTypes(false);
                        setTimeout(() => {
                            setOpenRegionSearch(true);
                        }, 10)
                    }}
                    color={"#4992FF"}
                    secondary={`${regions.types.length - 5} weitere einblenden`}
                    secondaryTypographyProps={{
                        color: '#4992FF',
                    }}
                />
            </ListItem>
        }

        {
            (!!regionInput && regionInput.length > 0) && <Fragment>
                <ListItem sx={{backgroundColor: "#F4F4F4"}}>
                    <ListItemText
                        secondary={"VOLLTEXT"}
                    />
                </ListItem>

                <ListItem
                    onMouseDown={(event) => {
                        if(!!onFocusRegion){
                            onFocusRegion(false)
                        }
                        if(!!onSelect){
                            onSelect({type: "search", value: regionInput});
                        }

                        if(!!search){
                            search({type: "search", value: regionInput});
                        }
                    }}
                    sx={{borderBottom: "1px solid #ECECEC", paddingLeft: "20px", cursor: "pointer"}}
                    secondaryAction={
                        <IconButton edge="end" aria-label="go">
                            <ChevronRightLight />
                        </IconButton>
                    }>
                    <ListItemText
                        primary={`Nach ${regionInput} suchen`}
                    />
                </ListItem>
            </Fragment>
        }

    </List>
};
import * as React from 'react';
import Box from "@mui/material/Box";
import Search from "../../components/Search/Search";

export default function SearchContainer({goto}){
    return <Box className={"start-search-bar"}>
        <Search goto={goto}/>
    </Box>
}
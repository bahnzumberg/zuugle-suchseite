import * as React from 'react';
import {useEffect, useState} from 'react';
import Footer from "../../components/Footer/Footer";
import SearchContainer from "../Start/SearchContainer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useSearchParams} from "react-router-dom";
import {loadTour, loadTourConnections, loadTourConnectionsExtended, loadTours} from "../../actions/tourActions";
import {compose} from "redux";
import {connect} from "react-redux";
import {loadGPX} from "../../actions/fileActions";

const DetailReworked = ({loadTour, loadTours, loadTourConnections, loadTourConnectionsExtended, loadGPX}) => {

    console.log(loadTour);

    const [tour, setTour] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const tourId = searchParams.get("id");
        const city = searchParams.get("city");
        if (tourId && !tour) {
            console.log(tourId, tour);
            loadTour(tourId, city)
                .then(res => {
                    console.log(res?.data?.tour);
                    setTour(res?.data?.tour);
                });
        }
    }, []);

    return <>
        <SearchContainer goto={"/suche"}/>
        {(window?.selectedTour) && <div>
            <pre>{JSON.stringify(window?.selectedTour, null, 2)}</pre>
        </div>}
        <Box sx={{padding: 3}}>
            <Box className="mt-3">
                <Typography variant="h5">{tour?.range}</Typography>
            </Box>
            <Box className="mt-3">
                <Typography variant="h4">{tour?.title}</Typography>
            </Box>
        </Box>
        <div>
            map
        </div>
        <div>

        </div>
        <Footer></Footer>
    </>;
}

const mapDispatchToProps = {
    loadTour,
    loadTours,
    loadTourConnections,
    loadTourConnectionsExtended,
    loadGPX,
};

function mapStateToProps(state) {
    return {};
}

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
)(DetailReworked)
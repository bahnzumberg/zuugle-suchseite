import * as React from 'react';
import Footer from "../../components/Footer/Footer";
import SearchContainer from "../Start/SearchContainer";

const DetailReworked = () => {
    return <>
        <SearchContainer goto={"/suche"} />
        {(window?.selectedTour) && <div><pre>{JSON.stringify(window?.selectedTour, null, 2) }</pre></div>}
        <div>
            <div>title</div>
            <div>range</div>
        </div>
        <div>
            map
        </div>
        <div>

        </div>
        <Footer></Footer>
    </>;
}

export default DetailReworked;
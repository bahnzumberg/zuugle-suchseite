//FILE : ItineraryTourTimeLineContainer.js
// //after addMoreConnections() 
// // const formatDuration = (duration) => { 
// //     let _time = " ";
// //     _time = !!duration && convertNumToTime(duration, true);
// //     _time = _time.replace(/\s*h\s*$/, '');
// //     console.log("trimed time ", _time); // Output: "07:00"
// //     return _time;
// // }

// // replace "ca. {duration} Stunden Tour" with:
// // {t('details.circa')} {formatDuration(duration)} {t('details.stunden_tour')}

// // replace (lt. Tourenbeschreibung) with: 
// // {t('details.lt_tourbeschreibung')}

// // replace      {getNumberOfTransfers(
// //                         retObj,
// //                         "return_no_of_transfers"
// //                     )}{" "}
// //                     Umst.     
// // with :
// {getNumberOfTransfers(retObj,"return_no_of_transfers")} {t('details.umstiege')}

// // replace   L499 {getNumberOfTransfers(
//                 //     retObj,
//                 //     "return_no_of_transfers"
//                 // )}{" "}
//                 // Umst.
// // with:
// {getNumberOfTransfers(retObj,"return_no_of_transfers")} {t('details.umstiege')


// // L510 replace {createReturnEntries(twoReturns[index], retObj)}
// // with 
// {createReturnEntries(remainingReturns[index+2], retObj )}

//FILE : Main.js
// This code is in incoming 
setFilterActive(localStorage.getItem("activeFilter")); 
//In origin it is this :
setFilterActive(countFilterActive());

//seems like Ergebnis is not translated !
<Typography color={"black"} sx={{ textAlign: "center" }}>
{totalTours}{" "}
{totalTours == 1 ? " Ergebnis " : ` ${t("main.ergebnisse")}`}
</Typography>

//FILE : Search.js
// new params added :  page, pageKey and filter


//FILE : AutosuggestSearch.js SearchIcon has been taken out
{/* <SearchIcon
style={{strokeWidth: 1, stroke: '#101010', fill: '#101010'}}
/> */}

//FILE : Start.js
// no matomo code , to solve merge with matomo branch by Tobias


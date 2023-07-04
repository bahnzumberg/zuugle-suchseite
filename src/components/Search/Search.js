import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { loadFavouriteTours, loadTours } from "../../actions/tourActions";
import { compose } from "redux";
import { connect } from "react-redux";
import { loadCities } from "../../actions/cityActions";
import { Fragment, useEffect, useState } from "react";
import { loadRegions } from "../../actions/regionActions";
import { useSearchParams } from "react-router-dom";
import {
	// isResponsive,
	parseIfNeccessary,
	setOrRemoveSearchParam,
} from "../../utils/globals";
import { Modal } from "@mui/material";
import { useNavigate } from "react-router";
import { hideModal, showModal } from "../../actions/modalActions";
import FullScreenCityInput from "./FullScreenCityInput";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
// import FilterIcon from "../../icons/FilterIcon";
// import SearchIcon from "../../icons/SearchIcon";
// import IconButton from "@mui/material/IconButton";
// import GoIcon from "../../icons/GoIcon";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
export function Search({
	loadRegions,
	loadTours,
	goto,
	isMain,
	showModal,
	hideModal,
	allCities,
	isMapView,
	// additional arguments
	// loadCities,
	// cities,
	// regions,
	// isCityLoading,
	// loadFavouriteTours,
}) {
	//--------menus-----------------

	const [showMobileMenu, setShowMobileMenu] = React.useState(false);
	const [fSearchQuery, setFSearchQuery] = React.useState("");
	const [showFirstMenu, setShowFirstMenu] = React.useState(false);
	const [firstMenuOptions, setFirstMenuOptions] = React.useState([
		"GroBer Patel",
		"GroBer Priel",
		"GroBer Pythrgas",
	]);
	const [secondSearchQuery, setSecondSearchQuery] = React.useState("");
	const [showSecondMenu, setShowSecondMenu] = React.useState(false);
	const [secondMenuOptions, setSecondMenuOptions] = React.useState([
		"GroBer Patel",
		"GroBer Priel",
		"GroBer Pythrgas",
	]);

	// Translation
	const navigate = useNavigate();
	const { t } = useTranslation();
	// let [language,setLanguage]= useState(i18next.resolvedLanguage);
	let language = i18next.resolvedLanguage;

	//initialise
	const [placeholder, setPlaceholder] = useState(t("start.suche"));
	useEffect(() => {
		setPlaceholder(t("start.suche"));
	}, [language]);

	// console.log("Search arguments received: "); // output
	// console.log("Search arguments :loadRegions ",loadRegions); //(...args) => dispatch(actionCreator(...args));
	// console.log("Search arguments : loadTours", loadTours); //(...args) => dispatch(actionCreator(...args));
	// console.log("Search arguments , goto value :", goto); //     '/suche'
	// console.log("Search arguments : isMain", isMain);  //undefined
	// console.log("Search arguments : showModal", showModal);//(...args) => dispatch(actionCreator(...args));
	// console.log("Search arguments : hideModal ", hideModal);//(...args) => dispatch(actionCreator(...args));
	// console.log("Search arguments : allCities ", allCities[0]); //{value: 'amstetten', label: 'Amstetten'}
	// console.log("Search arguments : isMapView ", isMapView); // undefined
	const [searchParams, setSearchParams] = useSearchParams();
	const [cityInput, setCityInput] = useState("");
	const [regionInput, setRegionInput] = useState("");
	const [city, setCity] = useState(null);
	const [region, setRegion] = useState(null);
	const [activeFilter, setActiveFilter] = useState(false);
	const initialIsMapView = isMapView || false;

	const handleFocus = () => {
		setRegionInput("");
		setPlaceholder("");
	};

	const handleBlur = () => {
		setPlaceholder(t("start.suche"));
	};

	useEffect(() => {
		// pull out values from URL params
		let city = searchParams.get("city");
		let range = searchParams.get("range");
		let state = searchParams.get("state");
		let country = searchParams.get("country");
		let type = searchParams.get("type");
		let search = searchParams.get("search");
		let filter = searchParams.get("filter");
		let orderId = searchParams.get("sort");
		let provider = searchParams.get("p");

		// clgs :
		// only the following have actually changed , not necessarily in same instant : "city", "range", "orderId", "filter", rest remained null
		//console.log("searchParams ", JSON.stringify(searchParams)); //output:  searchParams  {};
		// console.log("city", city);
		// console.log("range", range);
		// console.log("state", state);
		// console.log("country", country);
		// console.log("type", type);
		// console.log("search", search);
		// console.log("filter", filter);
		// console.log("orderId", orderId);
		// console.log("provider", provider);
		if (!!city && !!allCities) {
			// if a city was passed in url params AND list of all cities is available as argument to Search then :
			const cityEntry = allCities.find((e) => e.value == city); // find the city object with the specified city name from the array "allCities"
			if (!!cityEntry) {
				// if you found the object of city e.g. {value: 'amstetten', label: 'Amstetten'}
				setCityInput(cityEntry.label); // set the state "cityInput" to this city LABEL only
				setCity(cityEntry); // set the state "city" to this city OBJECT, e.g. {value: 'amstetten', label: 'Amstetten'}
				writeCityToLocalStorage(city); // store the city NAME in local storage

				/** load regions initially */
				loadRegions({ city: city });
			}
		}

		if (!!!orderId || orderId == "relevanz") {
			searchParams.set("sort", "relevanz");
			setSearchParams(searchParams);
		}

		if (!!range) {
			console.log("Search : region in useEffect : " + range);
			setRegionInput(range);
			setRegion({ value: range, label: range, type: "range" });
		}

		if (!!search) {
			setRegionInput(search);
		}

		if (!!state) {
			setRegionInput(state);
			setRegion({ value: state, label: state, type: "state" });
		}

		if (!!country) {
			setRegionInput(country);
			setRegion({ value: country, label: country, type: "country" });
		}

		if (!!type) {
			setRegionInput(type);
			setRegion({ value: type, label: type, type: "type" });
		}

		// console.log("Search...Region inside useEffect :", region);
		// console.log("Search...search inside useEffect :", search);

		//return if start page - no load
		if (!!!isMain) {
			return;
		}

		let _filter = !!filter ? parseIfNeccessary(filter) : null;
		if (!!_filter) {
			filter = {
				..._filter,
				ignore_filter: true,
			};
		} else {
			filter = {
				ignore_filter: true,
			};
		}
		//clgs
		// console.log("city", city);
		// console.log("range", range);
		// console.log("state", state);
		// console.log("country", country);
		// console.log("type", type);
		// console.log("search", search);
		// console.log("filter", filter);
		// console.log("orderId", orderId);
		// console.log("provider", provider);
		for (const entry of searchParams.entries()) {
			console.log("searchParams entries : ", entry); //output : ['city', 'bischofshofen'] ['sort', 'relevanz']
		}

		// let result = loadTours({
		loadTours({
			city: city,
			range: range,
			state: state,
			country: country,
			type: type,
			search: search,
			filter: filter,
			sort: orderId,
			provider: provider,
			map: searchParams.get("map"),
		});
		// result.then((resolvedValue) => {
		//     console.log("result of load Tours", resolvedValue);
		// });
	}, [
		// useEffect dependencies
		searchParams && searchParams.get("city"),
		searchParams && searchParams.get("filter"),
		searchParams && searchParams.get("sort"),
		searchParams && searchParams.get("search"),
		searchParams && searchParams.get("type"),
		searchParams && searchParams.get("sort"),
		searchParams && searchParams.get("range"),
		searchParams && searchParams.get("map"),
		searchParams && searchParams.get("p"),
	]);
	// end useEffect

	const writeCityToLocalStorage = (city) => {
		localStorage.setItem("city", city);
	};

	// const changeTextMiddleware = (value, _function, _resetFunction) => {
	//     _function(value)
	//     _resetFunction(null)
	// }

	// const setCityInputMiddleware = (value) => {
	//     setCityInput(value)
	//     if (!!!value) {
	//         searchParams.delete("city")
	//         setSearchParams(searchParams)
	//         loadFavouriteTours({ sort: "relevanz", limit: 10, ranges: true })
	//     }
	// }

	// const onFocusCity = (value) => {
	//     setOpenCitySearch(!!value)
	// }
	// const onFocusRegion = (value) => {
	//     setOpenRegionSearch(!!value)
	// }

	const search = (tempRegion = null) => {
		let values = {};
		if (!!city && !!city.value) {
			values.city = city.value;
		}

		let _region = region;
		if (!!tempRegion) {
			_region = tempRegion;
		}

		if (!!_region && !!_region.value) {
			values[_region.type] = _region.value;
		} else if (!!regionInput) {
			values.search = regionInput;
		}

		if (!!searchParams.get("sort")) {
			values.sort = searchParams.get("sort");
		} else {
			values.sort = "relevanz";
		}

		values.map = searchParams.get("map");
		values.provider = searchParams.get("p");

		searchParams.delete("filter");
		// console.log("PART I / searchParams.get('search')", searchParams.get("search"))
		setOrRemoveSearchParam(searchParams, "city", values.city);
		setOrRemoveSearchParam(searchParams, "range", values.range);
		setOrRemoveSearchParam(searchParams, "search", values.search);
		setOrRemoveSearchParam(searchParams, "state", values.state);
		setOrRemoveSearchParam(searchParams, "country", values.country);
		setOrRemoveSearchParam(searchParams, "type", values.type);

		setSearchParams(searchParams);
		// console.log("PART II / searchParams.get('search')", searchParams.get("search"))
		//clg
		// for (const entry of searchParams.entries()) {
		//     console.log(entry); //output : ['city', 'bischofshofen'] ['sort', 'relevanz']
		// }

		if (!!goto) {
			// clg
			// console.log(`navigate : goto + ? + searchParams : ${goto}?${searchParams}`) // output : /suche?city=amstetten&sort=relevanz
			navigate(goto + "?" + searchParams);
		} else {
			console.log("values passed to loadTours :", values);
			loadTours(values).then((res) => {
				window.scrollTo({ top: 0 });
			});
		}
	}; // end search()

	const toggleFilter = () => {
		// code goes here for filter overlay
		console.log("Search.js toggleFilter() called");
		setActiveFilter(!activeFilter);
	};

	// const gotoHome = () => {
	//     let _city = searchParams.get("city")
	//     navigate(`/?${!!_city ? "city=" + _city : ""}`)
	// }

	const showCityModal = () => {
		showModal("MODAL_COMPONENT", {
			CustomComponent: FullScreenCityInput,
			searchParams,
			initialCity: cityInput,
			onSelect: (city) => {
				hideModal();
				if (!!city) {
					setCityInput(city.label);
					setCity(city);
				}
			},
			setSearchParams,
			title: "",
			modalSize: "lg",
			onBack: () => {
				hideModal();
			},
		});
	};

	// const showRegionInput = () => {
	//     showModal("MODAL_COMPONENT", {
	//         CustomComponent: FullScreenRegionInput,
	//         searchParams,
	//         initialRegion: regionInput,
	//         onSelect: (region) => {
	//             hideModal()
	//             if (!!region) {
	//                 setRegionInput(region.value)
	//                 setRegion(region)
	//                 search(region)
	//             }
	//         },
	//         setSearchParams,
	//         title: "",
	//         modalSize: "lg",
	//         onBack: () => {
	//             hideModal()
	//         },
	//     })
	// }

	// const onCustomRegionSubmit = () => {
	//     setOpenRegionSearch(false)
	//     search()
	// }

	// const resetRegionInput = () => {
	//     setRegionInput("")
	//     setRegion(null)
	//     setOpenRegionSearch(false)
	//     searchParams.delete("search")
	//     searchParams.delete("range")
	//     searchParams.delete("type")
	//     setSearchParams(searchParams)
	// }

	return (
		<Fragment>
			{showMobileMenu ? (
				<div className="mobileMenu">
					<div className="rowing" style={{ marginBottom: 15 }}>
						<div />
						<div className="rowing">
							<span className="boldTxt">Abbrechen</span>
							<span className="pointy" onClick={() => setShowMobileMenu(false)}>
								<ClearIcon style={{ fontSize: 60, marginLeft: 8 }} />
							</span>
						</div>
					</div>
					<div className="firstMobileMenu">
						<div className="rowing" style={{ marginBottom: 5 }}>
							<span className="boldTxt">Suche</span>
							<span />
						</div>
						<div
							className="rowing searchField"
							style={{ width: 275, marginRight: 5 }}
						>
							<div className="rowingLeft">
								<SearchIcon />
								<input
									className="searchInput"
									onChange={(e) => setFSearchQuery(e.target.value)}
									value={fSearchQuery}
									style={{ width: 195 }}
								/>
							</div>
							<span
								className="closeIcon"
								// style={{ marginRight: 10 }}
								onClick={() => setFSearchQuery("")}
							>
								<CloseIcon
									sx={{
										color: "#8B8B8B",
										width: 18,
										height: 18,
									}}
								/>
							</span>
						</div>
						{fSearchQuery &&
							firstMenuOptions
								.filter((item) => item.startsWith(fSearchQuery))
								.map((item) => (
									<span key={item} className="searchSuggestions">
										{item}
									</span>
								))}
					</div>
					<div
						className="firstMobileMenu"
						style={{ marginTop: 40, marginBottom: 50 }}
					>
						<div className="rowing" style={{ marginBottom: 5 }}>
							<span className="boldTxt">Dein Heimatbahnhof</span>
							<span />
						</div>
						<div
							className="rowing searchField"
							style={{ width: 275, marginRight: 5 }}
						>
							<div className="rowingLeft">
								<SearchIcon />
								<input
									className="searchInput"
									onChange={(e) => setSecondSearchQuery(e.target.value)}
									value={secondSearchQuery}
									style={{ width: 195 }}
								/>
							</div>
							<span
								className="closeIcon"
								// style={{ marginRight: 10 }}
								onClick={() => setSecondSearchQuery("")}
							>
								<CloseIcon
									sx={{
										color: "#8B8B8B",
										width: 18,
										height: 18,
									}}
								/>
							</span>
						</div>
						{secondSearchQuery &&
							secondMenuOptions
								.filter((item) => item.startsWith(secondSearchQuery))
								.map((item) => (
									<span key={item} className="searchSuggestions">
										{item}
									</span>
								))}
					</div>
					<div className="rowing">
						<span className="firstBtn">Dein Heimatbahnhof</span>
						<span className="secondBtn">Suchen</span>
					</div>
				</div>
			) : (
				<Box component={"div"} className="colCenter">
					{!showFirstMenu && !showSecondMenu && (
						<div className="centerInputField">
							<img
								src={`/app_static/img/searchIcon.png`}
								height={"25px"}
								width={"25px"}
								alt="search-icon"
							/>
							<span
								className="searchFirstText"
								onClick={() => {
									setShowFirstMenu(true);
								}}
							>
								Öffi-Touren im Alpenraum
							</span>
							<span className="verticalBar" />
							<span
								className="searchSecondText"
								onClick={() => setShowSecondMenu(true)}
							>
								Heimatbahnhof wählen
							</span>
							<span className="goBtn" onClick={search}>
								GO!
							</span>
						</div>
					)}
					{!showFirstMenu && !showSecondMenu && (
						<div className="mobileSearchField">
							<div className="rowing">
								<img
									src={`/app_static/img/searchIcon.png`}
									height={"25px"}
									width={"25px"}
									alt="search-icon"
								/>
								<div
									style={{
										alignItems: "center",
										justifyContent: "left",
										display: "flex",
										flexDirection: "column",
										paddingLeft: 10,
									}}
									onClick={() => setShowMobileMenu(true)}
								>
									<span
										className="searchFirstText"
										style={{ width: "100%", textAlign: "left", fontSize: 14 }}
									>
										Öffi-Touren im Alpenraum
									</span>
									<span
										className="searchSecondText"
										style={{
											width: "100%",
											textAlign: "left",
											paddingLeft: 10,
											fontSize: 14,
										}}
									>
										Heimatbahnhof wählen
									</span>
								</div>
							</div>
							<span className="goBtn" onClick={() => search()}>
								GO!
							</span>
						</div>
					)}
					{showFirstMenu && (
						<div className="centerMe">
							<Modal
								onClose={() => setShowFirstMenu(false)}
								open={showFirstMenu}
								style={
									{
										// marginTop: 30,
									}
								}
								className="centerMe"
							>
								<div className="firstMenu" style={{ marginTop: 75 }}>
									<div className="rowing" style={{ marginBottom: 5 }}>
										<span className="boldTxt">Suche</span>
										<span
											className="boldTxt underline pointy"
											onClick={() => setShowFirstMenu(false)}
										>
											Abbrechen
										</span>
									</div>
									<div className="rowing">
										<div className="rowing searchField">
											<div className="rowingLeft">
												<SearchIcon />
												<input
													className="searchInput"
													onChange={(e) => setFSearchQuery(e.target.value)}
													value={fSearchQuery}
												/>
											</div>
											<span
												className="closeIcon"
												// style={{ marginRight: 10 }}
												onClick={() => setFSearchQuery("")}
											>
												<CloseIcon
													sx={{
														color: "#8B8B8B",
														width: 18,
														height: 18,
													}}
												/>
											</span>
										</div>
										<div className="incircledArrow centerMe">
											<ArrowForwardOutlinedIcon
												style={{ fontSize: 30, color: "#4992FF" }}
											/>
										</div>
									</div>
									{showFirstMenu && (
										<div
											className="colLeft"
											style={{ marginLeft: 0, marginTop: 10 }}
										>
											{fSearchQuery &&
												firstMenuOptions
													.filter((item) => item.startsWith(fSearchQuery))
													.map((item) => (
														<span key={item} className="searchSuggestions">
															{item}
														</span>
													))}
											{fSearchQuery.trim() &&
												firstMenuOptions.filter((item) =>
													item.startsWith(fSearchQuery)
												).length === 0 && (
													<span className="searchSuggestions">
														No results found
													</span>
												)}
										</div>
									)}
								</div>
							</Modal>
						</div>
					)}
					{showSecondMenu && (
						<div className="centerMe">
							<Modal
								onClose={() => setShowSecondMenu(false)}
								open={showSecondMenu}
								style={
									{
										// paddingTop: 340,
									}
								}
								className="centerMe"
							>
								<div className="firstMenu" style={{ marginTop: 75 }}>
									<div className="rowing" style={{ marginBottom: 5 }}>
										<span className="boldTxt">Dein Heimatbahnhof?</span>
										<span
											className="boldTxt underline pointy"
											onClick={() => setShowSecondMenu(false)}
										>
											Abbrechen
										</span>
									</div>
									<div className="rowing">
										<div className="rowing searchField">
											<div className="rowingLeft">
												<SearchIcon />
												<input
													className="searchInput"
													onChange={(e) => setSecondSearchQuery(e.target.value)}
													value={secondSearchQuery}
													style={{ width: 400 }}
												/>
											</div>
											<span
												className="closeIcon"
												// style={{ marginRight: 10 }}
												onClick={() => setSecondSearchQuery("")}
											>
												<CloseIcon
													sx={{
														color: "#8B8B8B",
														width: 18,
														height: 18,
													}}
												/>
											</span>
										</div>
										<div className="incircledArrow centerMe">
											<ArrowForwardOutlinedIcon
												style={{ fontSize: 30, color: "#4992FF" }}
											/>
										</div>
									</div>
									{showSecondMenu && (
										<div
											className="colLeft"
											style={{ marginLeft: 0, marginTop: 10 }}
										>
											{secondSearchQuery &&
												secondMenuOptions
													.filter((item) => item.startsWith(secondSearchQuery))
													.map((item) => (
														<span
															key={item}
															className="searchSuggestions rowingStart"
														>
															<img
																src={`/app_static/img/grpSymbol.png`}
																className="ssiggestionQry"
															/>
															{item}
														</span>
													))}
											{secondSearchQuery.trim() &&
												secondMenuOptions.filter((item) =>
													item.startsWith(secondSearchQuery)
												).length === 0 && (
													<span className="searchSuggestions">
														No results found
													</span>
												)}
										</div>
									)}
								</div>
							</Modal>
						</div>
					)}
				</Box>
			)}
		</Fragment>
	);
}

const mapDispatchToProps = {
	loadCities,
	loadRegions,
	loadTours,
	loadFavouriteTours,
	showModal,
	hideModal,
};

const mapStateToProps = (state) => {
	return {
		loading: state.tours.loading,
		cities: state.cities.cities,
		allCities: state.cities.all_cities,
		regions: state.regions.regions,
		isCityLoading: state.cities.loading,
		isRegionLoading: state.regions.loading,
	};
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Search);

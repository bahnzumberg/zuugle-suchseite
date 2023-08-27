import * as React from 'react';
import {lazy, useEffect, useState} from 'react';
import Footer from "../../components/Footer/Footer";
import SearchContainer from "../Start/SearchContainer";
import InteractiveMap from "../../components/InteractiveMap";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "react-router-dom";
import {
	loadTour,
	loadTourConnectionsExtended,
	loadTourGpx,
	loadTourPdf,
	loadTours,
} from "../../actions/tourActions";
import { compose } from "redux";
import { connect } from "react-redux";
import { loadGPX } from "../../actions/fileActions";
import GpxParser from "gpxparser";
import { Divider } from "@mui/material";
import TourDetailProperties from "../../components/TourDetailProperties";
import moment from "moment/moment";
import { Buffer } from "buffer";
import fileDownload from "js-file-download";
import { parseFileName } from "../../utils/globals";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
// import {Alert} from "@mui/lab";
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ProviderLogo from "../../icons/ProviderLogo";
import DownloadIcon from "../../icons/DownloadIcon";
import PdfIcon from "../../icons/PdfIcon";
import { loadAllCities, loadCities } from "../../actions/cityActions";
import { useTranslation } from "react-i18next";
import Itinerary from "../../components/Itinerary/Itinerary";
import { useNavigate } from "react-router";
import DomainMenu from "../../components/DomainMenu";
// import LanguageMenu from "../../components/LanguageMenu";
// import { SearchFilter } from "../../components/SearchFilter/SearchFilter";
import {generateShareLink, loadShareParams} from "../../actions/crudActions";
import {
    EmailShareButton,
    EmailIcon,
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon
} from "react-share";
import ArrowBefore from "../../icons/ArrowBefore"
import ShareIcon from "../../icons/ShareIcon";
import Close from "../../icons/Close"
import {shortenText} from "../../utils/globals"
import { Fragment } from 'react';
import i18next from 'i18next';


const setGpxTrack = (url, loadGPX, _function) => {
	loadGPX(url).then((res) => {
		if (!!res && !!res.data) {
			let gpx = new GpxParser(); //Create gpxParser Object
			gpx.parse(res.data);
			if (gpx.tracks.length > 0) {
				const positions = gpx.tracks[0].points.map((p) => [p.lat, p.lon]);
				_function(positions);
			}
		}
	});
};

const DetailReworked = (props) => {
	const {
		loadTour,
		loadTours,
		loadTourConnectionsExtended,
		loadGPX,
		loadTourGpx,
		isGpxLoading,
		loadTourPdf,
		isPdfLoading,
		allCities,
		tour,
		loadCities,
		loadAllCities,
		showMobileMenu,
		setShowMobileMenu,
	} = props;

	const [connections, setConnections] = useState(null);
	const [activeConnection, setActiveConnection] = useState(null);
	const [activeReturnConnection, setActiveReturnConnection] = useState(null);
	const [dateIndex, setDateIndex] = useState(0);
	const [searchParams, setSearchParams] = useSearchParams();
	const [gpxPositions, setGpxPositions] = useState(null);
	const [anreiseGpxPositions, setAnreiseGpxPositions] = useState(null);
	const [abreiseGpxPositions, setAbreiseGpxPositions] = useState(null);
	const [tourDifficulty, setTourDifficulty] = useState(null);
	const [tourDifficultyOrig, setTourDifficultyOrig] = useState(null);
	const [renderImage, setRenderImage] = useState(null);
	//Triggers the generating of a new link
	const [isShareGenerating, setIsShareGenerating] = useState(false);
	//Complete share link
	const [shareLink, setShareLink] = useState(null);
	//Whether social media share buttons should be shown
	const [socialMediaDropDownToggle, setSocialMediaDropDownToggle] = useState(false);
	//Whether a warning that says that your local trainstation has not been used, should be shown
	const [showDifferentStationUsedWarning, setShowDifferentStationUsedWarning] = useState(false);
	let tourDuration = null;
	
	// Translation-related
	const { t } = useTranslation();
	const translateDiff = (diff) => {
		if (diff === "Leicht" || diff === "leicht") {
			return t("start.leicht");
		} else if (diff === "Schwer" || diff === "schwer") {
			return t("start.schwer");
		} else return t("start.mittel");
	};


	//gpx and pdf buttons show up only when menu language is German
	let pdfLanguagePermit = i18next.resolvedLanguage === "de" ; 

	const handleCloseTab = () => {
		window.close();
	  }

    const navigate = useNavigate();
    const goToStartPage = () => {
        let city = searchParams.get('city');
        navigate(`/?${!!city ? 'city=' + city : ''}`)
    }

	//max number of characters used per specific UI element (buttons) 
	const maxLength = 40;

	
	const [providerPermit, setProviderPermit] = useState(true);

	useEffect(() => {
		if( !!tour && tour.provider && tour.provider == "mapzssi"){
			setProviderPermit(false)
		}
	}, [tour])
	

    //Creating a new share link
    // useEffect(() => {
    //     if (isShareGenerating === true) {
    //         generateShareLink(tour.provider, tour.hashed_url, moment(activeConnection?.date).format('YYYY-MM-DD'), searchParams.get("city"))
    //             .then(res => {
    //                 if (res.success === true){
    //                     setShareLink(window.location.origin + "/tour?share=" + res.shareId);
    //                 } else {
    //                     console.log("Share link didn't generate as expected.");
    //                 }
    //             });
    //         setIsShareGenerating(false);
    //     }
    // }, [isShareGenerating]);

    useEffect(() => {
        setIsShareGenerating(false);
        setSocialMediaDropDownToggle(false);
    }, [dateIndex]);


    useEffect(() => {
        const shareId = searchParams.get("share") ?? null;
        const city = localStorage.getItem('city');
        //Redirects to according page when it is a share link
        if (shareId !== null) {
            loadShareParams(shareId, city).then(res => {
                if (res.success === true) {
                if (res.usedCityOfCookie === false) {
                    setShowDifferentStationUsedWarning(true);
                }
                const redirectSearchParams = new URLSearchParams();
                const date = moment(res.date);
                redirectSearchParams.set("id", res.tourId);
                redirectSearchParams.set("city", res.city);
                redirectSearchParams.set("datum", moment(date).format('YYYY-MM-DD'));
                lazy(navigate('/tour?' + redirectSearchParams.toString()));
                } else {
                    city && searchParams.set("city", city);
                    goToStartPage();
                }
            }).catch(err => {
                city && searchParams.set("city", city);
                goToStartPage();
            });
        }
        loadAllCities();
        loadCities({limit: 5});
        const tourId = searchParams.get("id");

		if (tourId) {
			loadTour(tourId, city)
			  .then(tourExtracted => {
				if (tourExtracted && tourExtracted.data && tourExtracted.data.tour) {

				tourDuration = !!tourExtracted.data.tour.duration &&  tourExtracted.data.tour.duration;
				setTourDifficulty (!!tourExtracted.data.tour.difficulty &&  tourExtracted.data.tour.difficulty);
				setTourDifficultyOrig(!!tourExtracted.data.tour.difficulty_orig &&  tourExtracted.data.tour.difficulty_orig);
				
				}
			  })
			  .catch(error => {
				if (error.response && error.response.status === 404) {
					console.error("DetailsReworked/ Tour not found:", error);
					// Handle the 404 error scenario
				} else {
					console.error("Error:", error);
					// Handle other errors
				}
			});
		}
		  
        if (tourId && city && !connections) {
            loadTourConnectionsExtended({id: tourId, city: city}).then(res => {
                if (res && res.data) {
                    setConnections(res.data.result);
                }
            })
        }
    }, [searchParams]);

	useEffect(() => {
		if (tour) {
			if (!tour.cities_object[searchParams.get("city")]) {
				//goToStartPage();  // check if this is desirable (was commented out by external guy)
			} else {
				setGpxTrack(tour.gpx_file, loadGPX, setGpxPositions);
				setGpxTrack(tour.totour_gpx_file, loadGPX, setAnreiseGpxPositions);
				setGpxTrack(tour.fromtour_gpx_file, loadGPX, setAbreiseGpxPositions);
				setRenderImage(!!tour?.image_url);
			}
		}
	}, [tour]);
	// }, [!!tour]);

	useEffect(() => {
		let index = dateIndex;
		if (connections) {
			let date = moment(searchParams.get("datum"));
			if (date.isValid()) {
				if (
					moment(date).isBetween(
						moment(connections[0].date),
						moment(connections[6].date),
						"days",
						"[]"
					)
				) {
					index = connections.findIndex(
						(connection) =>
							moment(connection.date).format("DD.MM.YYYY") ===
							date.format("DD.MM.YYYY")
					);
					setDateIndex(index);
				} else {
					goToStartPage();
				}
			}
			setActiveConnection(connections[index]);
			setActiveReturnConnection(connections[index].returns[0]);
		}
	}, [!!connections]);

	async function onDownload() {
		const connectionDate = activeConnection?.date;
		try {
			const response = await loadTourPdf({
				id: tour?.id,
				connection_id: !!activeConnection?.connections[0]
					? activeConnection?.connections[0].id
					: undefined,
				connection_return_id: !!activeReturnConnection
					? activeReturnConnection.id
					: undefined,
				connection_return_ids: !!activeConnection.returns
					? activeConnection.returns.map((e) => e.id)
					: [],
				connectionDate,
			});
			if (response) {
				let pdf = undefined;
				if (!!response.data) {
					response.data = JSON.parse(response.data);
					if (!!response.data.pdf) {
						pdf = response.data.pdf;
					}
				} else if (!response.data || !response.data.pdf) {
					console.log("no response");
				}

				if (!!pdf) {
					const fileName = response.data.fileName ? response.data.fileName : "";
					const buf = Buffer.from(pdf, "base64");
					fileDownload(buf, fileName, "application/pdf");
				}
			} else {
				console.log("no response is returned");
			}
		} catch (error) {
			console.log("error : ", error);
		}
	}

	const onDownloadGpx = () => {
		if (
			!!activeReturnConnection &&
			activeReturnConnection.fromtour_track_key &&
			!!activeConnection &&
			!!activeConnection?.connections[0]?.totour_track_key
		) {
			loadTourGpx({
				id: tour.id,
				key_anreise: activeConnection.connections[0].totour_track_key,
				key_abreise: activeReturnConnection.fromtour_track_key,
				type: "all",
			}).then(
				(res) => {
					if (!!res && !!res.data) {
						fileDownload(
							res.data,
							parseFileName(tour.title, "zuugle_", ".gpx")
						);
					}
				},
				(err) => {
					console.log("error: ", err);
				}
			);
		} else {
			loadTourGpx({ id: tour.id }).then(
				(res) => {
					if (!!res && !!res.data) {
						fileDownload(
							res.data,
							parseFileName(tour.title, "zuugle_", ".gpx")
						);
					}
				},
				(err) => {
					console.log("error: ", err);
				}
			);
		}
	};

	const downloadButtonsDisabled = () => {
		return (
			!!!tour ||
			!!!tour.gpx_file ||
			!!!activeConnection ||
			!!!activeConnection?.connections[0]?.totour_track_key ||
			!!!activeReturnConnection ||
			!!!activeReturnConnection.fromtour_track_key
		);
	};

	const updateActiveConnectionIndex = (index) => {
		setDateIndex(index);
		setActiveConnection(connections[index]);
		setActiveReturnConnection(connections[index].returns[0]);
	};

	// const shareButtonHandler = (event) => {
	// 	const clickedElement = event.target;
	// 	const svgButton = clickedElement.closest(".share-button"); // Find the closest parent with class "share-button"

	// 	if (svgButton) {
	// 		setIsShareGenerating(true);
	// 		setSocialMediaDropDownToggle((current) => !current);
	// 	}
	// };

	const actionButtonPart = (<Box className="tour-detail-action-btns-container">
		
			<>
			{providerPermit && 
				(<Button className="tour-detail-action-btns" disabled={downloadButtonsDisabled()} onClick={() => {
					onDownloadGpx();
				}}>
					<DownloadIcon /><span style={{ color: "#101010", width: "43px" }}>GPX</span>
					{!!isGpxLoading ?
						<CircularProgress sx={{ width: "20px", height: "20px", fontWeight: 600 }} size={"small"} />
						: <span style={{ color: "#8B8B8B" }}>
							{t("details.track_gps_geraet")}
						</span>
					}
				</Button>)
			}
			{
			pdfLanguagePermit && providerPermit && (
				<Button className="tour-detail-action-btns" disabled={downloadButtonsDisabled()}
					onClick={onDownload}>
					<PdfIcon /><span style={{ color: "#101010", width: "43px", fontWeight: 600 }}>PDF</span>
					{!!isPdfLoading ?
						<CircularProgress sx={{ width: "20px", height: "20px" }} size={"small"} />
						: <span style={{ color: "#8B8B8B" }}>  {shortenText(t('Details.pdf_loading_notice'), 0, maxLength)} </span>
					}
				</Button>)
			}
			
		{/*
        Share button
        When clicked, a link will be generated and the social media options will be shown
        */}
		<Button className="tour-detail-action-btns share-button" disabled={false}
			onClick={async () => {
			// Call generateShareLink and wait for completion
			await generateShareLink(tour.provider, tour.hashed_url, moment(activeConnection?.date).format('YYYY-MM-DD'), searchParams.get("city"))
				.then(res => {
				if (res.success === true) {
					setShareLink(window.location.origin + "/tour?share=" + res.shareId);
				} else {
					console.log("Share link didn't generate as expected.");
				}
				});
		
			setSocialMediaDropDownToggle(current => !current);
			// Return a resolved Promise to continue with the onClick
			return Promise.resolve();
			}}
			// onClick={() => {
			// // Toggle the socialMediaDropDownToggle state
			// setSocialMediaDropDownToggle(current => !current);
			// }}

		>
			<ShareIcon /><span style={{ color: "#101010", width: "43px", fontWeight: 600 }}>{t('details.teilen')}</span>
			<span style={{ color: "#8B8B8B", marginLeft: "15px" }}>{shortenText(t('details.teilen_description'), 0, maxLength)}</span>
		</Button>
		{/* <Button className="tour-detail-action-btns share-button" disabled={false}>
			<ShareIcon /><span style={{ color: "#101010", width: "43px", fontWeight: 600 }}>{t('details.teilen')}</span>
			<span style={{ color: "#8B8B8B", marginLeft: "15px" }}>{shortenText(t('details.teilen_description'), 0, maxLength)}</span>
		</Button> */}

		{/* <Button className="tour-detail-action-btns" disabled={false}
			onClick={() => {
				setIsShareGenerating(true);
				setSocialMediaDropDownToggle((current) => !current );
			}}>
			<ShareIcon /><span style={{ color: "#101010", width: "43px", fontWeight: 600 }}>{t('details.teilen')}</span>
			<span style={{ color: "#8B8B8B", marginLeft: "15px" }}>{shortenText(t('details.teilen_description'), 0, maxLength)}</span>
		</Button> */}
		{/*
        Specific social media buttons
        */}
		{/* {(socialMediaDropDownToggle && !isShareGenerating && shareLink !== null) && <div> */}
		{(socialMediaDropDownToggle && shareLink !== null) && <div>
			<TwitterShareButton windowWidth={800} windowHeight={800} className="tour-detail-action-btns" style={{ borderRadius: "12px", backgroundColor: "#00aced" }} url={shareLink} title={t('details.teilen_text')}>
				<TwitterIcon size={40} round={true} />
				<span style={{ color: "#101010", width: "43px", fontWeight: 600 }}>Twitter</span>
			</TwitterShareButton>
			<EmailShareButton windowWidth={800} windowHeight={800} className="tour-detail-action-btns" style={{ borderRadius: "12px", backgroundColor: "#7f7f7f" }} url={shareLink} subject={"Zuugle Tour"} body={t('details.teilen_text')}>
				<EmailIcon size={40} round={true} />
				<span style={{ color: "#101010", width: "43px", fontWeight: 600 }}>Email</span>
			</EmailShareButton>
			{/*Facebook has deprecated the quote feature, thus when sharing, only the link will be there - however the user can still write something on the post (but it needs to be done manually)*/}
			<FacebookShareButton windowWidth={800} windowHeight={800} className="tour-detail-action-btns" style={{ borderRadius: "12px", backgroundColor: "#3b5998" }} url={shareLink} quote={t('details.teilen_text')} hashtag={"Zuugle"}>
				<FacebookIcon size={40} round={true} />
				<span style={{ color: "#101010", width: "43px", fontWeight: 600 }}>Facebook</span>
			</FacebookShareButton>
			<WhatsappShareButton windowWidth={800} windowHeight={800} className="tour-detail-action-btns" style={{ borderRadius: "12px", backgroundColor: "#25d366" }} url={shareLink} title={t('details.teilen_text')}>
				<WhatsappIcon size={40} round={true} />
				<span style={{ color: "#101010", width: "43px", fontWeight: 600 }}>Whatsapp</span>
			</WhatsappShareButton>
			<Button className="tour-detail-action-btns" style={{ borderRadius: "12px", backgroundColor: "#d8d3cd", border: "none" }} onClick={() => {
				navigator.clipboard.writeText(shareLink);
			}}>
				<ContentPasteIcon color="white"></ContentPasteIcon>
				<span style={{ color: "#101010", width: "43px", fontWeight: 600 }}>{t('details.kopieren')}</span>
			</Button>
		</div>}

		{!!downloadButtonsDisabled() && (
			<div style={{ marginTop: "10px" }}>
				<span
					style={{ fontSize: "12px", color: "#101010", lineHeight: "12px" }}
				>
					{t("Details.gpx_loading_notice")}
				</span>
			</div>
		)}
		</>
	</Box>
	);

	return (
		<Box sx={{ backgroundColor: "#fff" }}>
			<Box className="newHeader" sx={{ position: "relative" }}>
				<Box comoponent={"div"} className="rowing blueDiv">
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Box sx={{ mr: "16px", cursor: "pointer", zIndex: "1301" }}  
							onClick={handleCloseTab}
						>
							<ArrowBefore style={{ stroke: "#fff", width: "34px", height: "34px" }} />
						</Box>
						<DomainMenu />
					</Box>
					<Box sx={{ mr: "16px", cursor: "pointer", zIndex: "1301" }} onClick={() => window.close()}>
						<Close style={{ stroke: "#fff", fill: "#fff", width: "24px", height: "24px" }} />
					</Box>
					{!searchParams.get('city') && <Box sx={{
						position: "fixed",
						right: 0,
						bottom: 0,
						top: 0,
						left: 0,
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						zIndex: "1300"
					}} />}

				</Box>
				{/* {!!allCities && allCities.length > 0 && ( */}
				<Box
					sx={{
						backgroundColor: "#FFF",
						position: "absolute",
						bottom: "0",
						transform: "translate(-50%, 50%)",
						display: "inline-flex",
						borderRadius: "20px",
						padding: "12px 15px",
						border: "2px solid #ddd",
						width: "100%",
						maxWidth: { xs: !searchParams.get('city') ? "360px" : "325px", md: !searchParams.get('city') ? "376px" : "600px" },
						boxSizing: "border-box",
						boxShadow: "rgba(100, 100, 111, 0.3) 0px 3px 20px 0px",
						zIndex:"1300"
					}}
				>
					<Box sx={{ width: "100%" }}>
						<SearchContainer
							pageKey="detail"
							goto={"/suche"}
						/>
					</Box>
				</Box>
				{/* )} */}
			</Box>
			<Box>
				{/* {!!allCities && allCities.length > 0 && (
					<Box
						alignItems={"center"}
						justifyContent={"center"}
						display="inline-block"
						sx={{
							position: "absolute",
							bottom: "0",
							left: "50%",
							transform: "translate(-50%,50%)",
							backgroundColor: "#FFF",
							borderRadius: "15px",
							padding: "12px 24px",
							border: "2px solid #ddd",
							boxShadow: "rgba(100, 100, 111, 0.3) 0px 3px 20px 0px",
							width: {
								xs: "75%",
								md: "600px",
								lg: "600px",
							},
							maxWidth: {
								xs: "325px",
								md: "600px",
							},
						}}
					>
						<Box elevation={1} className={"colCenter"}>
							<Search isMain={true} />
						</Box>
					</Box>
				)} */}
				<Box className="tour-detail-header">
					<Box className="mt-3">
						<Typography variant="title">{tour?.title}</Typography>
					</Box>
					<Box className="mt-3">
						<span className="tour-detail-tag">{tour?.range}</span>
					</Box>
				</Box>
				<div>
					<Box
						sx={{ width: "100%", position: "relative" }}
						className="tour-detail-map-container"
					>
						<InteractiveMap
							gpxPositions={gpxPositions}
							anreiseGpxPositions={anreiseGpxPositions}
							abreiseGpxPositions={abreiseGpxPositions}
							scrollWheelZoom={false}
						/>
					</Box>
					<div className="tour-detail-data-container">
						<Box>
							<TourDetailProperties tour={tour}></TourDetailProperties>
							<Box sx={{ textAlign: "left" }}>
								<div className="tour-detail-difficulties">
									<span className="tour-detail-difficulty">
										{tour && translateDiff(tourDifficulty)}
									</span>
									<span className="tour-detail-tag tour-detail-tag-gray">
										{tour && translateDiff(tourDifficultyOrig)}
									</span>
								</div>
								<Typography variant="textSmall">{tour?.description}</Typography>
							</Box>
							<div
								className="tour-detail-provider-container"
								onClick={() => {
  									window.open(tour?.url);
								}}
							>
								<div className="tour-detail-provider-icon">
									<ProviderLogo provider={tour?.provider} />
								</div>
								<div className="tour-detail-provider-name-link">
									<span className="tour-detail-provider-name">
										{tour?.provider_name}
									</span>
									<span className="tour-detail-provider-link">{tour?.url}</span>
								</div>
							</div>
							{renderImage && (
								<Box className="tour-detail-conditional-desktop">
									<Divider variant="middle" />
									<div className="tour-detail-img-container">
										<img
											src={tour?.image_url}
											alt="image"
											onError={() => {
												setRenderImage(false);
											}}
										/>
									</div>
								</Box>
							)}
							<Box className="tour-detail-conditional-desktop">
								{actionButtonPart}
							</Box>
						</Box>
						<Box className="tour-detail-itinerary-container">
							<Itinerary
								connectionData={connections}
								dateIndex={dateIndex}
								onDateIndexUpdate={(di) => updateActiveConnectionIndex(di)}
								tour={tour}
							></Itinerary>
						</Box>
						{renderImage && (
							<Box className="tour-detail-conditional-mobile">
								<Divider variant="middle" />
								<div className="tour-detail-img-container">
									<img
										src={tour?.image_url}
										alt="image"
										onError={() => {
											setRenderImage(false);
										}}
									/>
								</div>
							</Box>
						)}
						{
							<Box className="tour-detail-conditional-mobile">
								{actionButtonPart}
							</Box>
						}
					</div>
				</div>
				<div></div>
				<Divider variant="middle" />
			</Box>
			<Footer></Footer>
		</Box>
	);
};

const mapDispatchToProps = {
	loadTour,
	loadTours,
	loadTourConnectionsExtended,
	loadGPX,
	loadTourGpx,
	loadTourPdf,
	loadCities,
	loadAllCities,
};

function mapStateToProps(state) {
	return {
		isPdfLoading: state.tours.isPdfLoading,
		isGpxLoading: state.tours.isGpxLoading,
		cities: state.cities.cities,
		allCities: state.cities.all_cities,
		tour: state.tours.tour,
	};
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(
	DetailReworked
);

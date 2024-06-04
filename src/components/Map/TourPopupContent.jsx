import React from "react";
import { popupContent, popupHead, popupImage } from "./popupStyles.js";
import MountinImage from "./MountinImage.jsx";
// import TourCard from "../TourCard.js";

const TourPopupContent = ({
  onSelectTour,
  loadTourConnections,
  tourId,
  city,
  tour,
  isLoading
}) => {
  // get these and pass them to TourCard element with the argument "MapCard = true"
  // this distinction will result in last part of the jsx in CARD; {getAnreise()} and {getAbreise()}  will not be rendered for the MapCard
  // in the JSX below; remove the MountinImage and the text div below it to be replaced with the imported CARD

  console.log("L19 inside TourPopupContent !, tourId is :");
  console.log("tourId :",tourId );
  console.log("L21 TourPopupContent !, tour is :");
  console.log("tour :",tour );
  // const [tourDetail, setTourDetail] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);

  // const fetchTourDetail = async () => {
  //   if (!!tourId) {
  //     setIsLoading(true);
  //     const _tourDetail = await onSelectTour(tourId);
  //     setTourDetail(_tourDetail);
  //     setIsLoading(false);
  //     console.log("Tour details fetched:", _tourDetail);
  //   }
  // };

  // useEffect(() => {
  //   fetchTourDetail();
  //   console.log("L29 tour");
  //   console.log(tour);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tourId, tour]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    // <Popup 
    //   className="request-popup"
    //   keepInView = {true}
    // >
      <div
        className={popupContent}
        // onClick={e => handlePopupClick(e,mark.id)}
      >
        <MountinImage
          imageUrl="public/img/mountain-landscape-2031539_640.jpg"
          className={popupImage}
        />
        <div className={`m-2 ${popupHead}`}>Tour Details</div>
      </div>
    // </Popup>
  );
};

export default TourPopupContent;

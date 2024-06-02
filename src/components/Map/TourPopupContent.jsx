import React from "react";
import { popupContent, popupHead, popupImage } from "./popupStyles.js";
import MountinImage from './MountinImage.jsx';

const TourPopupContent = ({onSelectTour, loadTourConnections, tourId}) => {

   const onClickHandler = ()=>{
      console.log("L9 : onclickhandler !", tourId)
      if(!!tourId) onSelectTour(tourId)
   }

    return (
   
      <div
        className={popupContent}
        onClick={onClickHandler}
        >
        <MountinImage
          imageUrl="app_static/img/mountain-landscape-2031539_640.jpg"
          className={popupImage}
        />
        <div className={`m-2 ${popupHead}`}>
          Tour Details
        </div>
        {/* <GoIcon
              style={{
                  transform: "scale(1.55)",
                  strokeWidth: 0,
              }}
          /> */}
      </div>
  );
}

export default TourPopupContent;




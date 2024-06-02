import React from "react";
import {Popup} from 'react-leaflet';
import { popupContent, popupHead, popupImage } from "./popupStyles.js";
import MountinImage from './MountinImage.jsx';

const TourPopupContent = (handlePopupClick, tourId) => (
  <Popup 
    className="request-popup"
  >
    <div
      className={popupContent}
      // onClick={()=>handlePopupClick()}
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
  </Popup>
);

export default TourPopupContent;




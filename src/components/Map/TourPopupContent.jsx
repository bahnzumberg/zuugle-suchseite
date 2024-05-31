import React from "react";
import {Popup} from 'react-leaflet';
import { popupContent, popupHead, popupImage } from "./popupStyles.js";
import MountinImage from './MountinImage.jsx';

const TourPopupContent = () => (
  <Popup className="request-popup">
    <div
      className={popupContent}
      // onClick={e => handlePopupClick(e,mark.id)}
    >
      <MountinImage
        imageUrl="src/components/Map/mountain-landscape-2031539_640.jpg"
        // style={{
        //   width: "200px",
        //   height: "100px",
        //   marginBottom: "10px", // Add some margin for spacing
        // }}
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




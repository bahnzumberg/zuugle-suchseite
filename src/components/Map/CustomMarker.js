import React, { useEffect, useRef } from "react";
import { Marker } from "react-leaflet";
import ReactDOM from 'react-dom';
import TourPopupContent from "./TourPopupContent.jsx";

const CustomMarker = ({ position, mark, onSelectTour, loadTourConnections, city, tour, StartIcon }) => {
  const markerRef = useRef();

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.bindPopup(
        `<div id="popup-${mark.id}"></div>`, {
          className: "request-popup",
          keepInView: true
        }
      );
    }
  }, [mark.id]);

  const handleClick = async () => {
    const tourId = mark.id;
    if (tourId && city) {
      try {
        const _tourDetail = await onSelectTour(tourId);
        const _tour = _tourDetail.data.tour;
        console.log("Tour details fetched:", _tour);
        if (_tour) {
          setTimeout(() => {
            const container = document.getElementById(`popup-${tourId}`);
            if (container) {
              ReactDOM.render(
                <TourPopupContent
                  tourId={tourId}
                  onSelectTour={onSelectTour}
                  loadTourConnections={loadTourConnections}
                  city={city}
                  tour={_tour}
                />,
                container
              );
              if (markerRef.current) {
                markerRef.current.openPopup();
              }
            }
          }, 100);
        }
      } catch (error) {
        console.error("Error loading tour:", error);
      }
    } else {
      window.location.reload();
    }
  };

  return (
    <Marker
      position={position}
      icon={StartIcon}
      ref={markerRef}
      eventHandlers={{ click: handleClick }}
    />
  );
};

export default CustomMarker;

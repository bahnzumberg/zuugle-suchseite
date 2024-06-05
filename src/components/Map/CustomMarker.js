import React, { useEffect, useRef } from "react";
import { Marker, useMapEvents } from "react-leaflet";
import { createRoot } from 'react-dom/client';
import TourPopupContent from "./TourPopupContent.jsx";

const CustomMarker = ({ position, mark, onSelectTour, loadTourConnections, city, tour, StartIcon }) => {
  const markerRef = useRef();
  const popupRootRefs = useRef({});

  useEffect(() => {
    if (markerRef.current) {
        console.log("L11 UE / markerRef.current exists", `popup-${mark.id}`)
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
        console.log("L26 in handleClick Tour details fetched:", _tour);
        if (_tour) {
            const root = popupRootRefs.current[tourId];
            if (root) {
              root.render(
                <TourPopupContent
                  tourId={tourId}
                  onSelectTour={onSelectTour}
                  loadTourConnections={loadTourConnections}
                  city={city}
                  tour={_tour}
                />
              );
  
              if (markerRef.current) {
                console.log("L45 Opening popup for marker", `popup-${tourId}`);
                markerRef.current.openPopup();
              } else {
                console.log("L47 markerRef.current is null");
              }
            } else {
              console.error("L50 Root not found for", `popup-${tourId}`);
            }
          }
      } catch (error) {
        console.error("Error loading tour:", error);
      }
    } else {
      window.location.reload();
    }
  };

  useMapEvents({
    popupopen: (e) => {
      if (e.popup._source === markerRef.current) {
        const tourId = mark.id;
        const container = document.getElementById(`popup-${tourId}`);
        if (container) {
          popupRootRefs.current[tourId] = createRoot(container);
          console.log("L20 Root created on popupopen for", `popup-${tourId}`);
        } else {
          console.error("L22 Container not found on popupopen", `popup-${tourId}`);
        }
      }
    }
  });

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

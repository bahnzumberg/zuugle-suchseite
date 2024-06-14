import React, { useEffect, useRef } from "react";
import { Marker } from "react-leaflet";
import { createRoot } from 'react-dom/client';
import TourPopupContent from "./TourPopupContent.jsx";

const CustomMarker = ({ position, mark, onSelectTour, loadTourConnections, city, tour, StartIcon }) => {
  const markerRef = useRef(null);
  const popupRootRefs = useRef({});

  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      console.log("L11 UE / markerRef.current exists", `popup-${mark.id}`);
      marker.bindPopup(
        `<div id="popup-${mark.id}"></div>`, {
          className: "request-popup",
          keepInView: true
        }
      );
    } else {
      console.log("L13 UE / markerRef.current is null in useEffect");
    }
  }, [mark.id]);

  const handleClick = async () => {
    console.log("L20 handleClick called");
    const marker = markerRef.current;
    console.log("L21 markerRef.current in handleClick:", marker);

    const tourId = mark.id;
    if (tourId && city) {
      try {
        const _tourDetail = await onSelectTour(tourId);
        const _tour = _tourDetail.data.tour;
        console.log("L26 in handleClick Tour details fetched:", _tour);
        if (_tour) {
          const container = document.getElementById(`popup-${tourId}`);
          if (container) {
            if (!popupRootRefs.current[tourId]) {
              popupRootRefs.current[tourId] = createRoot(container);
            }
            const root = popupRootRefs.current[tourId];
            root.render(
              <TourPopupContent
                tourId={tourId}
                onSelectTour={onSelectTour}
                loadTourConnections={loadTourConnections}
                city={city}
                tour={_tour}
              />
            );

            if (marker) {
                marker.openPopup();
                const markerElement = marker.getElement();
                if (markerElement) {
                    const popupEvent = new Event('popupopen', { bubbles: true });
                    markerElement.dispatchEvent(popupEvent);
                } else {
                    console.log("Marker element is null or undefined.");
                }
            } else {
                console.log("Marker is null or undefined.");
            }
            
          } else {
            console.error("L50 Container not found", `popup-${tourId}`);
          }
        }
      } catch (error) {
        console.error("Error loading tour:", error);
      }
    } else {
      window.location.reload();
    }
  };

  useEffect(() => {
    const marker = markerRef.current;
    const handlePopupOpen = (e) => {
      console.log("L15 handlePopupOpen called", `popup-${mark.id}`);
      console.log("L16 markerRef.current in handlePopupOpen:", marker);

      if (e.popup._source === marker) {
        const tourId = mark.id;
        const container = document.getElementById(`popup-${tourId}`);
        if (container && !popupRootRefs.current[tourId]) {
          popupRootRefs.current[tourId] = createRoot(container);
          console.log("L20 Root created on popupopen for", `popup-${tourId}`);
        } else if (!container) {
          console.error("L22 Container not found on popupopen", `popup-${tourId}`);
        }
      }
    };

    if (marker) {
      marker.on('popupopen', handlePopupOpen);
    }

    // Cleanup function
    return () => {
      if (marker) {
        marker.off('popupopen', handlePopupOpen);
      }
    };
  }, [mark.id]);

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

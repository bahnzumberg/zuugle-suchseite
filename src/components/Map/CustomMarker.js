import React, { useEffect, useRef } from "react";
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import TourPopupContent from "./TourPopupContent.jsx";

const CustomMarker = ({ position, mark, onSelectTour, loadTourConnections, city, StartIcon, clusterRef }) => {
  const popupRootRefs = useRef({});

  useEffect(() => {
    const handlePopupOpen = async (e) => {
      console.log("L15 handlePopupOpen called", `popup-${mark.id}`);
      const tourId = mark.id;
      const container = document.getElementById(`popup-${tourId}`);
      if (container && !popupRootRefs.current[tourId]) {
        popupRootRefs.current[tourId] = createRoot(container);
        console.log("L20 Root created on popupopen for", `popup-${tourId}`);

        // Fetch and render TourPopupContent inside the popup
        const _tourDetail = await onSelectTour(tourId);
        const _tour = _tourDetail.data.tour;
        console.log("L26 in handlePopupOpen Tour details fetched:", _tour);
        if (_tour) {
          const root = popupRootRefs.current[tourId];
          console.log("L24 !!root is true or false ? ", !!root)
          root.render(
            <TourPopupContent
              tourId={tourId}
              onSelectTour={onSelectTour}
              loadTourConnections={loadTourConnections}
              city={city}
              tour={_tour}
            />
          );
        }
      }
    };

    if (clusterRef.current) {
        console.log("L39 inside if (clusterRef.current) ")
      // Create marker and bind popup
      const marker = L.marker(position, { icon: StartIcon });
      marker.bindPopup(`<div id="popup-${mark.id}"></div>`, {
        className: "request-popup",
        keepInView: true
      }).on('popupopen', handlePopupOpen);

      // Add the marker to the MarkerClusterGroup
      clusterRef.current.addLayer(marker);

      // Cleanup function
      return () => {
        marker.closePopup(); // Close the popup instead of removing the marker
      };
    }
  }, [mark.id, onSelectTour, loadTourConnections, city, position, StartIcon, clusterRef]); // Added position to dependencies

  return null; // Render nothing as the marker is created dynamically
};

export default CustomMarker;

// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css'; // Leaflet CSS

// const MY_API_URL = 'https://your-api.com/data/'; // Replace with your API endpoint

// function App() {
//   const [markers, setMarkers] = useState([]);

//   useEffect(() => {
//     // Fetch initial marker data
//     fetch('https://your-marker-data.com/markers') // Replace with your marker data endpoint
//       .then(response => response.json())
//       .then(data => setMarkers(data));
//   }, []);

//   const handleMarkerClick = async (marker) => {
//     const response = await fetch(`${MY_API_URL}${marker.id}`);
//     const data = await response.json();
//     marker.popupContent = data.message; // Update marker popup content
//   };

//   return (
//     <MapContainer center={[51.505, -0.09]} zoom={13}>
//       <TileLayer
//         attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       {markers.map((marker) => (
//         <Marker key={marker.id} position={[marker.lat, marker.lng]}>
//           <Popup>
//             {marker.popupContent ? marker.popupContent : 'Loading...'}
//           </Popup>
//           <Marker.onEvent onClick={() => handleMarkerClick(marker)} />
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// }

import React, { useState, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css'; // Optional for custom styles

const API_URL = 'https://your-api.com/tours/{id}'; // Replace with your API endpoint

function App() {
  const [markers, setMarkers] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null); //******/ THIS ***********
  const markerRef = useRef(null);

  useEffect(() => {
    // Fetch initial markers on component mount
    fetch('https://your-api.com/markers') // Replace with your marker data endpoint
      .then((response) => response.json())
      .then((data) => setMarkers(data));
  }, []);

  const handleMarkerClick = async (markerId) => {
    if (!markerId) return;   //******/ THIS ***********

    setSelectedTour(null); // ******/ THIS ***********
    setIsLoading(true);   // ******/ THIS ***********

    try {
      const response = await fetch(API_URL.replace('{id}', markerId));
      const tourData = await response.json();
      setSelectedTour(tourData);      //******/ THIS ***********
    } catch (error) {
      console.error('Error fetching tour details:', error);
    } finally {
      setIsLoading(false);     //******/ THIS ***********
    }
  };

  const [isLoading, setIsLoading] = useState(false);    //******/ THIS ***********

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '400px' }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lon]}
          ref={markerRef}
          eventHandlers={{
            click: () => handleMarkerClick(marker.id),
          }}
        >
          {selectedTour && selectedTour.id === marker.id && ( //******/ THIS ***********
            <Popup ref={markerRef}>
              {isLoading ? (
                <p>Loading tour details...</p>
              ) : (
                <TourPopupContent // ******/ THIS ***********
                  tour={selectedTour}  //******/ THIS ***********
                />
              )}
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
}

// Replace with your component to display tour details within the popup
function TourPopupContent({ tour }) {
  return (
    <div>
      <h2>{tour.name}</h2>
      <p>{tour.description}</p>
      {/* Add other tour details as needed */}
    </div>
  );
}

render(<App />, document.getElementById('root'));



//     var clickCount = 0;
//     map.on("click", function(event) {
//         var lat = event.latlng.lat;
//         var lng = event.latlng.lng;    
//         ++clickCount;
//         var popupContent = "<h2>Marker " + clickCount + "</h2>"
//             + "<p>Map coordinates:</p>"
//             + "<ul><li>Latitude: " + lat + "</li>"
//             + "<li>Longitude: " + lng + "</li></ul>";
// ​
//         var myMarker = L.marker([lat, lng],
//         {
//             title: "Click to see map coordinates"
//         }).bindPopup(popupContent).addTo(map); 
//     })

import * as React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.fullscreen/Control.FullScreen.css';
import 'leaflet.fullscreen/Control.FullScreen.js';

export default function InteractiveMap({ gpxPositions, anreiseGpxPositions, abreiseGpxPositions }) {
  const polyRef = React.useRef();
  const startIcon = L.icon({
    iconUrl: 'app_static/img/pin-icon-start.png',
    shadowUrl: 'app_static/img/pin-shadow.png',
    iconSize: [30, 41],
    iconAnchor: [15, 41],
  });
  const endIcon = L.icon({
    iconUrl: 'app_static/img/pin-icon-end.png',
    shadowUrl: 'app_static/img/pin-shadow.png',
    iconSize: [30, 41],
    iconAnchor: [15, 41],
  });

  const StartMarker = ({ position }) => {
    return <Marker position={position} icon={startIcon}></Marker>;
  };

  const EndMarker = ({ position }) => {
    return <Marker position={position} icon={endIcon}></Marker>;
  };

//   const MapFullScreenControl = () => {
//     const map = useMap();
//     return (
//       <div className="leaflet-control-container">
//         <div className="leaflet-top leaflet-right">
//           <div className="leaflet-control-zoom leaflet-bar leaflet-control">
//             <a
//               className="leaflet-control-zoom-in fullscreen-toggle-icon leaflet-bar-part leaflet-bar-part-top-and-bottom"
//               href="#"
//               title="Toggle fullscreen"
//               role="button"
//               onClick={() => {
//                 map.toggleFullscreen();
//               }}
//             >
//               <span className="fa fa-expand" />
//             </a>
//           </div>
//         </div>
//       </div>
//     );
//   };

  const getStartMarker = () => {
    if (!!anreiseGpxPositions && anreiseGpxPositions.length > 0) {
      return <StartMarker position={anreiseGpxPositions[0]} />;
    } else if (!!gpxPositions && gpxPositions.length > 0) {
      return <StartMarker position={gpxPositions[0]} />;
    }
  };

  const getEndMarker = () => {
    if (!!abreiseGpxPositions && abreiseGpxPositions.length > 0) {
      return <EndMarker position={abreiseGpxPositions[abreiseGpxPositions.length - 1]} />;
    } else if (!!gpxPositions && gpxPositions.length > 0) {
      return <EndMarker position={gpxPositions[gpxPositions.length - 1]} />;
    }
  };

  
  return (
      <MapContainer
      scrollWheelZoom={true}
      maxZoom={17}
      center={[47.800499, 13.04441]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      whenCreated={(mapInstance) => {
          mapInstance.addControl(L.control.fullscreen());
          mapInstance.doubleClickZoom.disable();
          mapRef.current = mapInstance; // store reference to map instance
        }}
        >
      <TileLayer url="https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png" />
      {!!gpxPositions && gpxPositions.length > 0 && (
          <Polyline
          ref={polyRef}
          pathOptions={{ color: "red" }}
          positions={gpxPositions}
          />
          )}
        {
            getStartMarker()
        }
        {
            getEndMarker()
        }
    </MapContainer>
  );
}
  

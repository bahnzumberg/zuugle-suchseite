import * as React from 'react';
import {useRef, useEffect, useMemo} from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { divIcon } from 'leaflet';

export default function InteractiveMap({ gpxPositions, anreiseGpxPositions, abreiseGpxPositions, scrollWheelZoom=false }) {
    const polyRef = useRef();
    const mapRef  = useRef(null);

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

  // const MapFullScreenControl = () => {
  //   const map = useMap();
  //   return (
  //     <div className="leaflet-control-container">
  //       <div className="leaflet-top leaflet-right">
  //         <div className="leaflet-control-zoom leaflet-bar leaflet-control">
  //           <a
  //             className="leaflet-control-zoom-in fullscreen-toggle-icon leaflet-bar-part leaflet-bar-part-top-and-bottom"
  //             href="#"
  //             title="Toggle fullscreen"
  //             role="button"
  //             onClick={() => {
  //               map.toggleFullscreen();
  //             }}
  //           >
  //             <span className="fa fa-expand" />
  //           </a>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // useEffect(() => {
  //   console.log("L 57: inside first useEffect ")
  //   const map = mapRef.current;

  //   // remove previous layers and markers
  //   map.eachLayer(layer => {
  //     if (!layer._url) { // ignore tile layers
  //       map.removeLayer(layer);
  //     }
  //   });

  //   if (!!polyRef.current){
  //     map.fitBounds(polyRef.current.getBounds());
  //   }

  //   return () => {
  //     // remove the map when the component is unmounted
  //     map.remove();
  //   }
  // }, [gpxPositions, anreiseGpxPositions, abreiseGpxPositions]);

  // useEffect(() => { // do we need to initialize before use?
  //   if(!!mapRef && mapRef.current != null) {
  //     mapRef.current=null;
  //     console.log("L 59 : mapRef is initialized")
  //   }
  // })

  // useEffect(() => {
  //   const map = mapRef.current?.leafletElement;

  //   function handleClick() {
  //     console.log('Map clicked!');
  //   }

  //   if (map) {
  //     map.on('click', handleClick);
  //   }

  //   return () => {
  //     if (map) {
  //       map.off('click', handleClick);
  //     }
  //   };
  // }, []);

useEffect(() => {
  // function initializingMap() {
  // call this method before you initialize your map.
  // var container = L.DomUtil.get("map");
  //   let container= undefined ;

  //   if(!!mapRef && !!mapRef.current._container){
  //     container = mapRef.current._container;
  //   }
  //   if (container != null) {
  //     container._leaflet_id = null;
  //   }
  //   console.log("Iniside initializeMap , container._leaflet_id ", container._leaflet_id)
  // }
  const initializeMap = () => {
    if (!!mapRef && !!mapRef.current) {
      // console.log(
      //   " initializeMap : before if , _leaflet_id :",
      //   mapRef.current._leaflet_id
      // );
      if (!!mapRef.current._leaflet_id && mapRef.current._leaflet_id != (null || undefined)) {
        console.log("Just before initialization")
        mapRef.current._leaflet_id = null;
      }
    }
  };
  initializeMap();
  //clg
  // mapRef.current
  //   ? console.log(
  //       "L130 Interactive, ouside if(), mapRef.current._leaflet_id is :",
  //       mapRef.current._leaflet_id
  //     )
  //   : console.log("L133 mapRef.current is falsy");

  return () => {
    // remove the map when the component is unmounted
    let map = mapRef.current;
    // map ? console.log("L138 returning InteractiveM , map is", map) : console.log("L138 Interactive, this is", map);
    if(!!map) {
      map = map.remove();
    } 
  };
}, []);

useEffect(() => {
  let map = mapRef.current;
    // (map && map._leaflet_id) ? console.log("147  InteractiveM useEffect2 , map._leaflet_id is", map._leaflet_id) : console.log("L147 Interactive, this is", map);
  if (!!mapRef && !!mapRef.current) {
    if (!!polyRef.current) {
      mapRef.current.fitBounds(polyRef.current.getBounds());
    }
  }
});

// useEffect(() => {
//     if(!!polyRef.current){
//         if(!!mapRef && !!mapRef.current){
//             mapRef.current.fitBounds(polyRef.current.getBounds());
//         }
//     }
// })

// useEffect(() => {
//     if(polyRef.current && mapRef.current) {
//         mapRef.current.fitBounds(polyRef.current.getBounds());
//     }
// }, [polyRef.current]);

  const getStartMarker = () => {
    if (anreiseGpxPositions && anreiseGpxPositions.length > 0) {
      return <StartMarker position={anreiseGpxPositions[0]} />;
    } else if (gpxPositions && gpxPositions.length > 0) {
      return <StartMarker position={gpxPositions[0]} />;
    }
  }
  const getEndMarker = () => {
    if (!!abreiseGpxPositions && abreiseGpxPositions.length > 0) {
      return <EndMarker position={abreiseGpxPositions[abreiseGpxPositions.length - 1]} />;
    } else if (!!gpxPositions && gpxPositions.length > 0) {
      return <EndMarker position={gpxPositions[gpxPositions.length - 1]} />;
    }
  };

  // const memoizedMapContainer = React.useCallback( () => {
  //   return (
  //     <MapContainer
  //     // key={()=>generateKey()}
  //     ref={mapRef}
  //     scrollWheelZoom={true}
  //     maxZoom={17}
  //     center={[47.800499, 13.04441]}
  //     zoom={13}
  //     style={{ height: "100%", width: "100%" }}
  //     // whenCreated={(mapInstance)=> { mapRef.current = mapInstance }}
  //   >
  //       <TileLayer url="https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png" />
  //       {!!gpxPositions && gpxPositions.length > 0 && (
  //           <Polyline
  //           ref={polyRef}
  //           pathOptions={{ color: 'red' }}
  //           positions={gpxPositions}
  //           />
  //       )}
  //       {getStartMarker()}
  //       {getEndMarker()}
  //       {!!anreiseGpxPositions && anreiseGpxPositions.length > 0 && (
  //       <Polyline
  //           pathOptions={{ color: 'blue' }}
  //           positions={anreiseGpxPositions}
  //       />
  //       )}
  //       {!!abreiseGpxPositions && abreiseGpxPositions.length > 0 && (
  //       <Polyline
  //           pathOptions={{ color: 'green' }}
  //           positions={abreiseGpxPositions}
  //       />
  //       )}
  //       {/* <MapFullScreenControl /> */}

  //   </MapContainer>
  
  //     )
  //   },[gpxPositions])


  return (
    // <div>
    //   {memoizedMapContainer()}
    // </div>
    <MapContainer
      // key={()=>generateKey()}
      ref={mapRef}
      scrollWheelZoom={scrollWheelZoom}
      maxZoom={17}
      center={[47.800499, 13.04441]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      // whenCreated={(mapInstance)=> { mapRef.current = mapInstance }}
    >
        <TileLayer url="https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png" />
        {!!gpxPositions && gpxPositions.length > 0 && (
            <Polyline
            ref={polyRef}
            pathOptions={{ color: 'red' }}
            positions={gpxPositions}
            />
        )}
        {getStartMarker()}
        {getEndMarker()}
        {!!anreiseGpxPositions && anreiseGpxPositions.length > 0 && (
        <Polyline
            pathOptions={{ color: 'blue' }}
            positions={anreiseGpxPositions}
        />
        )}
        {!!abreiseGpxPositions && abreiseGpxPositions.length > 0 && (
        <Polyline
            pathOptions={{ color: 'green' }}
            positions={abreiseGpxPositions}
        />
        )}
        {/* <MapFullScreenControl /> */}

    </MapContainer>
  )
}
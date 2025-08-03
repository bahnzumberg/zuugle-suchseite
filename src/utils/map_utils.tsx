import { Marker } from "../components/Map/TourMapContainer";

export const formatMapClusterNumber = (number: number) => {
  // Absolute numbers
  number = Math.abs(number);

  if (number < 1000) {
    return number.toString();
  } else {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
};

export const createIdArray = (markers: Marker[]) => {
  return markers.map((marker) => marker.id);
};

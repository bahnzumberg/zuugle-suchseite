
export const formatMapClusterNumber = (number) => {
  // Absolute numbers
  number = Math.abs(number);

  if (number < 1000) {
      return number.toString();
    } else {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
};


export  const createIdArray = (markers) => {
  return markers.map(marker => marker.id);
};


export const checkOnlyMapParams = (filterParam = false)=>{
  // filterParam should be searchParams.get('filter')
  // should return true if : 
  //map params are the only ones inside the filter object 
  //OR map params do not exist 

  let mapFilter = false;

  if (!!filterParam) {
    try {
      const filterObject = JSON.parse(decodeURIComponent(filterParam));
      const keyCount = Object.keys(filterObject).length;
      // console.log("L16 filterObject : ", filterObject)
      // console.log("L17 keyCount : ", keyCount)

      if(filterObject){
          
          mapFilter = 
              //map filter object is made up of 2 keys,  AND NOT FALSY
              filterObject &&
              keyCount === 2 && // Check if there are exactly two keys
              filterObject.hasOwnProperty('coordinatesSouthWest') && 
              filterObject.hasOwnProperty('coordinatesNorthEast')
      }
      // consoleLog("L34 mapFilter :", mapFilter) //true or false
      return mapFilter;
    } catch (error) {
      console.error('Error parsing filter object:', error);
      return false
    }
  }else return mapFilter;
}
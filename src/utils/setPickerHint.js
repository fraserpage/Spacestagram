import { numberWithCommas } from "./formatters"

export default function setPickerHint(roverPhotos, sol){

  const solInfo = roverPhotos.find(e => e.sol === sol)
  if (isNaN(sol)){
    return String.fromCharCode(160)
  }
  if (typeof solInfo === 'undefined'){
    return `No photos from Sol ${sol}`
  }
  else{
    return `${numberWithCommas(solInfo.total_photos)} photos from Sol ${sol}`
  }
}
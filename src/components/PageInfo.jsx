import './PageInfo.css'

export default function PageInfo(props) {
  return(
    <p className="page-info">
      <span> Sol {props.sol} </span> 
      {props.camFilter ? 
        <span> | Camera: {props.camFilter} </span> 
        : ''
      }
      <span> | Photos {props.slice+1} - {props.sliceEnd} of {props.photoSet.length} </span>
      <span> | Page {Math.ceil(props.sliceEnd / props.photosPerPage)}/{Math.ceil(props.photoSet.length / props.photosPerPage)} </span>
      <span> | <label htmlFor="photosPerPage">Photos per page: </label>
        <input 
          type="number"
          onChange={props.handleChangePhotosPerPage} 
          value={props.photosPerPage} 
          min={1} 
          max={999}
          name="photosPerPage" 
          id="photosPerPage"
          required
        /></span>
    </p>
  )
}
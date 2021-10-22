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
          inputmode="numeric"
          onChange={props.handleChangePhotosPerPage} 
          value={props.photosPerPageCtrl} 
          min={1} 
          max={999}
          name="photosPerPageCtrl" 
          id="photosPerPageCtrl"
          required
        />
      </span>
      {props.photosPerPageErr && <div style={{'color':'red', '--wght':600, 'display':'inline-block'}}>{props.photosPerPageErr}</div>}
    </p>
  )
}
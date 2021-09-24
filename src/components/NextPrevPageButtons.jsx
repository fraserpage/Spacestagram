export default function NextPrevPageButtons(props){
  return(
    <>
      {props.slice > 0 && 
        <button onClick={()=>props.handleLoadMore(-1)}>Previous page</button>
      }
      {props.sliceEnd !== props.solInfo.total_photos && 
        <button onClick={()=>props.handleLoadMore(1)}>Next page</button>
      } 
    </>
  )
}
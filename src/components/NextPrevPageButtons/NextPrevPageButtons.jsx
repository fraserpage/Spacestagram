export default function NextPrevPageButtons(props){
  return(
    <>
      {props.slice > 0 && 
        <button onClick={()=>props.handleLoadMore(-1)}>Previous page</button>
      }
      {props.sliceEnd !== props.photoSet.length && 
        <button onClick={()=>props.handleLoadMore(1)}>Next page</button>
      } 
    </>
  )
}
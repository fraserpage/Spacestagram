import "./LoadingPlaceholders.css"

export default function  LoadingPlaceholders(props) {
  return(
    <ul>
      {Array.from(Array(props.photosPerPage)).map((p,i)=>(
        <li key={i} className="loading">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </li>
      ))}
    </ul>
  )
}
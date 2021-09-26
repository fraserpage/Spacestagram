import "./RoverSelect.css"

export default function RoverSelect(props){
  return(
    <div>
      <h2>Select a rover</h2>
      <ul className="rover-list">
        {props.rovers.map((rover,i)=>(
          <li 
            className={rover===props.rover.name ? 'current':''} 
            key={i} 
            onClick={()=>props.handleSelectRover(rover)}
          >
            {rover}
          </li>
        ))}
      </ul>
    </div>
  )
}
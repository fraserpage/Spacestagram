export default function RoverInfo(props){
  return(
    <>
      {props.rover.name && 
        <div>
          <h2>{props.rover.name}</h2>
          <p>Launch date: <span>{props.rover.launch_date}</span></p>
          <p>Landing date: <span>{props.rover.landing_date}</span></p>
          <p>Latest day with photos: <span>{props.rover.max_date}</span></p>
          <p>Martian days (Sols) with photos: <span>{props.rover.max_sol}</span></p>
          <p>Status: <span>{props.rover.status}</span></p>
          <p>Total Photos: <span>{props.rover.total_photos}</span></p>

          <form onSubmit={props.handleRequestPhotos}>
            <label htmlFor="solPicker">Show me photos from Sol day:</label>
            <span>
              <input 
                type="number" 
                id="solPicker"
                name="solPicker" 
                min="0" 
                max={props.rover.max_sol} 
                value={props.solPicker} 
                onChange={props.handleChange} 
                required 
              />
              <button className="bg-white" type="submit">Go</button>
            </span>
          </form>
        </div>
      }
    </>
  )
}
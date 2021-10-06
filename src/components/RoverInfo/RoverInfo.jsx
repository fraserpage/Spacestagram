import './RoverInfo.css'
import { numberWithCommas } from "../../utils/formatters"

export default function RoverInfo(props){
  return(
    <>
      {props.rover.name && 
        <div>
          <h2>{props.rover.name}</h2>
          <dl>
            <dt>Launch date: </dt>
              <dd>{props.rover.launch_date}</dd>
            <dt>Landing date: </dt>
              <dd>{props.rover.landing_date}</dd>
            <dt>Latest day with photos: </dt>
              <dd>{props.rover.max_date}</dd>
            <dt><div>Last Martian day (Sol) since landing with photos: </div></dt>
              <dd>{numberWithCommas(props.rover.max_sol)}</dd>
            <dt>Status: </dt>
              <dd>{props.rover.status.toUpperCase()}</dd>
            <dt>Total Photos: </dt>
              <dd>{numberWithCommas(props.rover.total_photos)}</dd>
          </dl>

          <form onSubmit={props.handleRequestPhotos}>
            <label htmlFor="solPicker">Show me photos from Sol:</label>
            <span>
              <input 
                type="number" 
                id="solPicker"
                name="solPicker" 
                min="0" 
                max={props.rover.max_sol} 
                value={props.solPicker} 
                onChange={props.handleChangeSolInput} 
                required 
              />
              <button className="bg-white" type="submit">Go</button>
            </span>
          </form>
          <p>{props.solPickerHint}</p>
        </div>
      }
    </>
  )
}
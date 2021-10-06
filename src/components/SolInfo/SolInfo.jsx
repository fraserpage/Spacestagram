import { numberWithCommas } from "../../utils/formatters"

export default function SolInfo(props){
  return(
    <>
      {typeof props.sol === 'number' &&
        <div>
          <h2>Sol {props.sol}</h2>
          {props.solInfo.empty ? 
            <p>No photos from this date</p> 
          : 
            <>
              <p>Earth Date: <span>{props.solInfo.earth_date}</span></p>
              <p>Total Photos: <span>{numberWithCommas(props.solInfo.total_photos)}</span></p>
              <h3>
                Cameras in use:<br/>
                (Click to filter)
              </h3>
              <ul className="cameras">
                {props.solInfo.cameras.map((c,i) => (
                  <li 
                    key={i} 
                    onClick={()=>props.handleFilterCamera(c)}
                    className={c===props.camFilter ? 'current':''} 
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </>
          }
        </div>
      }
    </>
  )
}
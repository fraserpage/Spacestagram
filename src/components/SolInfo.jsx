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
              <p>Total Photos: <span>{props.solInfo.total_photos}</span></p>
              <h3>Cameras in use:</h3>
              <ul>
                {props.solInfo.cameras.map((c,i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </>
          }
        </div>
      }
    </>
  )
}
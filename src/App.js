import { Component } from "react";
import { getManifest, getPhotosBySol } from "./utils/fetch";
import './App.css';

const rovers = ['Curiosity','Perseverance','Opportunity','Spirit']

export default class App extends Component{

  state = {
    rover:{
      name:'',
      landing_date:'',
      launch_date:'',
      max_date:'',
      max_sol:'',
      photos:'',
      status:'',
      total_photos:'',
    },
    sol:1,
    photos:[],
    slice:0,
    likes:{}
  }

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  handleRequestPhotos = async (evt) => {
    evt.preventDefault();
    const data = await getPhotosBySol(this.state.rover.name, this.state.sol)
    console.log(data)
    this.setState({
      photos:data.photos
    })
  }

  handleLoadMore = (evt) => {
    this.setState({
      slice:this.state.slice + 6
    })
  }

  handleSelectRover = async (rover) => {
    const data = await getManifest(rover)
    console.log(data)
    this.setState({
      rover:data.photo_manifest,
      photos:[],
      sol:1,
      slice:0
    })
  }

  handleClickLike = (id) => {
    const newLikes = this.state.likes
    newLikes[id] = !newLikes[id]
    this.setState({
      likes:newLikes
    })
  }

  render(){ 
    return(
      <div>
        <h1>Spacestagram</h1>
        <header>
          <div>
            <h2>Select a rover</h2>
            <ul className="rover-list">
              {rovers.map((rover,i)=>(
                <li 
                  className={rover===this.state.rover.name ? 'current':''} 
                  key={i} 
                  onClick={()=>this.handleSelectRover(rover)}
                >
                  {rover}
                </li>
              ))}
            </ul>
          </div>
          {this.state.rover.name && 
            <div>
              <h2>{this.state.rover.name}</h2>
              <p>Launch date: {this.state.rover.launch_date}</p>
              <p>Landing date: {this.state.rover.landing_date}</p>
              <p>Latest day with photos: {this.state.rover.max_date}</p>
              <dt>Martian days with photos: {this.state.rover.max_sol}</dt>
              <p>Status: {this.state.rover.status}</p>
              <p>Total Photos: {this.state.rover.total_photos}</p>
    
              <form onSubmit={this.handleRequestPhotos}>
                <label>show me photos from Sol day:</label>
                <input 
                  type="number" 
                  name="sol" 
                  min="1" 
                  max={this.state.rover.max_sol} 
                  value={this.state.sol} 
                  onChange={this.handleChange} 
                  required 
                />
                <button className="bg-white" type="submit">Go</button>
              </form>
            </div>
          }
        </header>
        
        <main>
          {this.state.photos.length ?
            <p>Showing Sol day {this.state.sol} photos {this.state.slice+1} - {this.state.slice+6} <button onClick={this.handleLoadMore}>Next page</button></p>
            : ''
          }
          <ul>
            {this.state.photos.slice(this.state.slice, this.state.slice+6).map( p => (
              <li key={p.id}>
                <img src={p.img_src} alt={`Mars rover ${this.state.rover.name} photo id ${p.id}, taken with ${p.camera.full_name} on ${p.earth_date}`}/>
                <p>ID: {p.id}</p>
                <p>Camera: {p.camera.full_name}</p>
                <p>Earth Date: {p.earth_date}</p>
                <button onClick={ evt => this.handleClickLike(p.id) }>
                  {this.state.likes[p.id] ? "Unlike" : "Like"}
                </button>
              </li>
            ))}
          </ul>
        </main>
      </div>
    )
  }
}

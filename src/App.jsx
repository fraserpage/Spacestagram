import { Component } from "react";
import { getManifest, getPhotosBySol } from "./utils/fetch";
import './App.css';
import NextPrevPageButtons from "./components/NextPrevPageButtons";

export default class App extends Component{

  state = {
    rovers: ['Curiosity','Perseverance','Opportunity','Spirit'],
    rover:{
      name:'',
      landing_date:'',
      launch_date:'',
      max_date:'',
      max_sol:'',
      photos:[],
      status:'',
      total_photos:'',
    },
    solInfo:{empty:true},
    solPicker:0,
    sol:'',
    photos:[],
    slice:0,
    likes:{},
    photosPerPage:8
  }

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: parseInt(evt.target.value),
    });
  };

  handleRequestPhotos = async (evt) => {
    evt.preventDefault();
    this.setState({
      sol: this.state.solPicker
    })
    const solInfo = this.state.rover.photos.find(e => e.sol === this.state.solPicker)
    if (typeof solInfo === 'undefined'){
      this.setState({
        solInfo: {empty: true},
        photos:[]
      })
    }
    else{
      this.setState({
        solInfo: {
          empty: false,
          ...solInfo
        },
        loading: true
      })

      let data = await getPhotosBySol(this.state.rover.name, this.state.sol)
      // For some reason, the API sometimes gives back an empty object when it ought not too
      // In these cases, just try it one more time
      if (data.length !== this.state.solInfo.total_photos){
        data = await getPhotosBySol(this.state.rover.name, this.state.sol)
      }
      this.setState({
        loading: false,
        photos: data.photos,
        slice:0,
        sliceEnd: 
          this.state.photosPerPage > this.state.solInfo.total_photos ? 
            this.state.solInfo.total_photos 
          : this.state.photosPerPage
      })
    }
  }

  handleLoadMore = (dir) => {
    if (this.state.sliceEnd === this.state.solInfo.total_photos){
      this.setState({
        slice: this.state.slice - this.state.photosPerPage,
        sliceEnd: this.state.slice
      })
    }
    else{
      this.setState({
        slice: this.state.slice + (this.state.photosPerPage * dir),
        sliceEnd: 
          this.state.sliceEnd + (this.state.photosPerPage * dir) > this.state.solInfo.total_photos ? 
              this.state.solInfo.total_photos 
            : this.state.sliceEnd + (this.state.photosPerPage * dir)
      })
    }
  }

  handleSelectRover = async (rover) => {
    const data = await getManifest(rover)
    this.setState({
      rover:data.photo_manifest,
      photos:[],
      slice:0,
      sol:''
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
              {this.state.rovers.map((rover,i)=>(
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
              <p>Launch date: <span>{this.state.rover.launch_date}</span></p>
              <p>Landing date: <span>{this.state.rover.landing_date}</span></p>
              <p>Latest day with photos: <span>{this.state.rover.max_date}</span></p>
              <p>Martian days (Sols) with photos: <span>{this.state.rover.max_sol}</span></p>
              <p>Status: <span>{this.state.rover.status}</span></p>
              <p>Total Photos: <span>{this.state.rover.total_photos}</span></p>
    
              <form onSubmit={this.handleRequestPhotos}>
                <label for="solPicker">Show me photos from Sol day:</label>
                <span>
                  <input 
                    type="number" 
                    id="solPicker"
                    name="solPicker" 
                    min="0" 
                    max={this.state.rover.max_sol} 
                    value={this.state.solPicker} 
                    onChange={this.handleChange} 
                    required 
                  />
                  <button className="bg-white" type="submit">Go</button>
                </span>
              </form>
            </div>
          }
          {typeof this.state.sol === 'number' &&
            <div>
              <h2>Sol {this.state.sol}</h2>
              {this.state.solInfo.empty ? 
                <p>No photos from this date</p> 
              : 
                <>
                  <p>Earth Date: <span>{this.state.solInfo.earth_date}</span></p>
                  <p>Total Photos: <span>{this.state.solInfo.total_photos}</span></p>
                  <h3>Cameras in use:</h3>
                  <ul>
                    {this.state.solInfo.cameras.map((c,i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </>
              }
            </div>
          }
        </header>
        
        <main>
          {this.state.loading &&
            <div className="loading">Loading...</div>
          }
          {this.state.photos.length > 0 && 
            <>
              <p>Sol {this.state.sol} | Photos {this.state.slice+1} - {this.state.sliceEnd} | Page {Math.ceil(this.state.sliceEnd / this.state.photosPerPage)}/{Math.ceil(this.state.solInfo.total_photos / this.state.photosPerPage)}</p>
              <NextPrevPageButtons {...this.state} handleLoadMore={this.handleLoadMore}/>
            </>
          }
          <ul>
            {this.state.photos.slice(this.state.slice, this.state.sliceEnd).map( p => (
              <li key={p.id}>
                <img src={p.img_src} alt={`Mars rover ${this.state.rover.name} photo id ${p.id}, taken with ${p.camera.full_name} on ${p.earth_date}`}/>
                <p>ID: {p.id}</p>
                <p>Camera: {p.camera.full_name}</p>
                <p>Earth Date: {p.earth_date}</p>
                <p>Sol: {p.sol}</p>
                <button onClick={ evt => this.handleClickLike(p.id) } style={this.state.likes[p.id] ? {backgroundColor:"pink", color:"black"} : {} }>
                  {this.state.likes[p.id] ? "Unlike" : "Like"}
                </button>
              </li>
            ))}
          </ul>
          {this.state.photos.length > 0 && 
            <NextPrevPageButtons {...this.state} handleLoadMore={this.handleLoadMore}/>
          }
        </main>
      </div>
    )
  }
}

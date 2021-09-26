import { Component } from "react";
import { getManifest, getPhotosBySol } from "./utils/fetch";
import {Link} from 'react-scroll'
import './App.css';
import RoverSelect from "./components/RoverSelect";
import RoverInfo from "./components/RoverInfo";
import SolInfo from "./components/SolInfo";
import NextPrevPageButtons from "./components/NextPrevPageButtons";
import Photo from "./components/Photo";

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
          <RoverSelect 
            {...this.state} 
            handleSelectRover={this.handleSelectRover}
          />
          <RoverInfo
            {...this.state}
            handleRequestPhotos={this.handleRequestPhotos}
            handleChange={this.handleChange}
          />
          <SolInfo {...this.state}/>
        </header>
        
        <main id="main">
          {this.state.photos.length > 0 && 
            <>
              <p>Sol {this.state.sol} | Photos {this.state.slice+1} - {this.state.sliceEnd} | Page {Math.ceil(this.state.sliceEnd / this.state.photosPerPage)}/{Math.ceil(this.state.solInfo.total_photos / this.state.photosPerPage)}</p>
              <NextPrevPageButtons {...this.state} handleLoadMore={this.handleLoadMore}/>
            </>
          }
          <ul>
            {this.state.loading ?
              Array.from(Array(this.state.photosPerPage)).map((p,i)=>(
                <li key={i} className="loading">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </li>
              ))
            : 
              this.state.photos.slice(this.state.slice, this.state.sliceEnd).map( p => (
                <Photo key={p.id} {...this.state} p={p} handleClickLike={this.handleClickLike}/>
              ))
            }
          </ul>
          {this.state.photos.length > 0 && 
            <Link  to="main" spy={false} smooth={true}>
              <NextPrevPageButtons {...this.state} handleLoadMore={this.handleLoadMore}/>
            </Link>
          }
        </main>
      </div>
    )
  }
}

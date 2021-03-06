import { Component } from "react";
import { getManifest, getPhotosBySol } from "./utils/fetch";
import {Link} from 'react-scroll'
import { SRLWrapper } from "simple-react-lightbox";
import './App.css';
import RoverSelect from "./components/RoverSelect/RoverSelect";
import RoverInfo from "./components/RoverInfo/RoverInfo";
import SolInfo from "./components/SolInfo/SolInfo";
import PageInfo from "./components/PageInfo/PageInfo";
import NextPrevPageButtons from "./components/NextPrevPageButtons/NextPrevPageButtons";
import Photo from "./components/Photo/Photo";
import LoadingPlaceholders from "./components/LoadingPlaceholders/LoadingPlaceholders";
import setPickerHint from "./utils/setPickerHint";

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
    solPickerHint:"",
    sol:'',
    photos:[],
    photoSet:[],
    camFilter:"",
    slice:0,
    likes:{},
    photosPerPage:8,
    photosPerPageCtrl:8,
    photosPerPageErr:""
  }

  setSliceEnd = (dir) => {
    return this.state.sliceEnd + (this.state.photosPerPage * dir) > this.state.photoSet.length ? 
              this.state.photoSet.length 
            : this.state.sliceEnd + (this.state.photosPerPage * dir)
  }

  resetSliceEnd = (numPhotos, photosPerPage) =>{
    return photosPerPage > numPhotos ? 
              numPhotos 
            : photosPerPage
  }

  handleChangeSolInput = (evt) => {
    const sol = parseInt(evt.target.value)
    this.setState({
      [evt.target.name]: sol,
      solPickerHint: setPickerHint(this.state.rover.photos, sol)
    });
  }

  handleChangePhotosPerPage = (evt) => {
    const photosPerPage = parseInt(evt.target.value)
    this.setState({
      [evt.target.name]: photosPerPage
    });
    if (photosPerPage > 1000){
      this.setState({
        photosPerPageErr:"Ok let's not go crazy with "+photosPerPage+" photos per page! You'll crash your browser! Max 999, deal?"
      })
      return
    }
    if (photosPerPage > 0){
      this.setState({
        photosPerPage: photosPerPage,
        slice: 0,
        sliceEnd: this.resetSliceEnd(this.state.photoSet.length, photosPerPage),
        photosPerPageErr:""
      });
    }
  }

  handleSelectRover = async (rover) => {
    const data = await getManifest(rover)
    this.setState({
      rover:data.photo_manifest,
      photos:[],
      photoSet:[],
      slice:0,
      sol:'',
      camFilter:'',
      solPickerHint: setPickerHint(data.photo_manifest.photos, this.state.solPicker)
    })
  }

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
        photoSet: data.photos,
        camFilter:'',
        slice:0,
        sliceEnd: this.resetSliceEnd(data.photos.length, this.state.photosPerPage)
      })
    }
  }

  handleFilterCamera = (camera) => {
    if (camera === this.state.camFilter){
      this.setState({
        photoSet: this.state.photos,
        camFilter: "",
        slice:0,
        sliceEnd: this.resetSliceEnd(this.state.photos.length, this.state.photosPerPage)
      })
    }
    else{
      const newPhotoSet = this.state.photos.filter(p => p.camera.name === camera)
      this.setState({
        photoSet: newPhotoSet,
        camFilter: camera,
        slice:0,
        sliceEnd: this.resetSliceEnd(newPhotoSet.length, this.state.photosPerPage)
      })
    }
    
  }

  handleLoadMore = (dir) => {
    if (this.state.sliceEnd === this.state.photoSet.length){
      this.setState({
        slice: this.state.slice - this.state.photosPerPage,
        sliceEnd: this.state.slice
      })
    }
    else{
      this.setState({
        slice: this.state.slice + (this.state.photosPerPage * dir),
        sliceEnd: this.setSliceEnd(dir)
      })
    }
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
        <p>A fun little React app for exploring Mars Rover photos</p>
        <p>by <a href="https://fraser.page">Fraser Page</a></p>
        <header>
          <RoverSelect 
            {...this.state} 
            handleSelectRover={this.handleSelectRover}
          />
          <RoverInfo
            {...this.state}
            handleRequestPhotos={this.handleRequestPhotos}
            handleChangeSolInput={this.handleChangeSolInput}
          />
          <SolInfo 
            handleFilterCamera={this.handleFilterCamera}
            {...this.state}
          />
        </header>
        
        <main id="main">
          {this.state.photoSet.length > 0 && 
            <>
              <PageInfo {...this.state} handleChangePhotosPerPage={this.handleChangePhotosPerPage} />
              <NextPrevPageButtons {...this.state} handleLoadMore={this.handleLoadMore}/>
            </>
          }
          {!isNaN(this.state.photosPerPage) && 
            this.state.loading ?
              <LoadingPlaceholders {...this.state}/>
            : 
              <SRLWrapper>
                <ul>
                  {this.state.photoSet.slice(this.state.slice, this.state.sliceEnd).map( p => (
                    <Photo key={p.id} {...this.state} p={p} handleClickLike={this.handleClickLike}/>
                  ))}
                </ul>
              </SRLWrapper>
            
          }
          {this.state.photoSet.length > 0 && this.state.photosPerPage > 0 &&
            <Link  to="main" spy={false} smooth={true}>
              <NextPrevPageButtons {...this.state} handleLoadMore={this.handleLoadMore}/>
            </Link>
          }
        </main>
      </div>
    )
  }
}

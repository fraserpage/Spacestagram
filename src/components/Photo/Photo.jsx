import { Component } from "react";
import './Photo.css';

export default class Photo extends Component{

  state = {
    loaded: false
  }

  render(){
    return(
      <li>
        <figure className={this.state.loaded ? null : 'loading'}>
          <img 
            onLoad={() => this.setState({loaded: true})}
            src={this.props.p.img_src} 
            alt={`Mars rover ${this.props.rover.name} photo id ${this.props.p.id}, taken with ${this.props.p.camera.full_name} on ${this.props.p.earth_date}`}
          />
          <figcaption>
            <div>ID: {this.props.p.id}</div>
            <div>Camera: {this.props.p.camera.full_name}</div>
            <div>Earth Date: {this.props.p.earth_date}</div>
          </figcaption>
        </figure>
        <button onClick={ evt => this.props.handleClickLike(this.props.p.id) } style={this.props.likes[this.props.p.id] ? {backgroundColor:"pink", color:"black"} : {} }>
          {this.props.likes[this.props.p.id] ? "Unlike" : "Like"}
        </button>
      </li>
    )
  }
}
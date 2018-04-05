import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Logo from './Components/Logo/Logo';
import Navigation from './Components/Navigation/Navigation';
import Rank from './Components/Rank/Rank';
import ImageLinkForm  from './Components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import './App.css';



const particlesOptions={

      particles: {
             number:{
                value:30,
                density:{
                  enable:true,
                  value_area:800
                }
             }
     }
}

const initialState={
    input:' ',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn:false,
      user:{
          id:'',
          name: '',
          email: '',
          entries:0,
          joined: ''
        }
}

class App extends Component {
  constructor(){
    super();
    this.state=initialState;

  }

  loadUser=(data)=>{
    this.setState({user:{
          id:data.id,
          name: data.name,
          email: data.email,
          entries:data.entries,
          joined: data.joined
    }})
  }
  calculateFaceLocation =(data)=>{
     const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box; 
     const image = document.getElementById('inputImage');
     const width =Number(image.width);
     const height=Number(image.height);
     return{
      leftCol:clarifaiFace.left_col*width,
      topRow: clarifaiFace.top_row*height,
      rightCol: width-(clarifaiFace.right_col*width),
      bottomRow: height -(clarifaiFace.bottom_row*height),
     }
} 
// connecting to our backend server
  // componentDidMount(){
  //   fetch('http://localhost:4000/')
  //         .then(response=>response.json())
  //         .then(console.log)
  // }

  displayFaceBox=(box)=>{
    this.setState({box:box})
  }
  onInputChange = (event) => {
    this.setState({input:event.target.value });
  }

  onRouteChange=(route)=>{
    if(route==='signout'){
      this.setState(initialState)
    }else if (route==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route});
  }

   onButtonSubmit=()=>{
      this.setState({imageUrl:this.state.input})
        fetch('https://pure-waters-42759.herokuapp.com/imageurl', {
            method: 'post',
            headers:{'Content-type':'application/json'},
            body:JSON.stringify({
                input:this.state.input,
        })
     }).then(response=>response.json())
      .then(response =>{
        if(response){
           fetch('https://pure-waters-42759.herokuapp.com/image', {
            method: 'put',
            headers:{'Content-type':'application/json'},
            body:JSON.stringify({
                id:this.state.user.id,
        })
     }).then(response=>response.json())
           .then(count=>{
              this.setState(Object.assign(this.state.user,{entries:count}))
           }).catch(console.log)
        }
       this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err=>console.log(err));  
  }
  
 
  render() {
    //const {isSignedIn, imageUrl, route, box}=this.state;
    return (
      <div className="App">
       <Particles className='particles' 
              params={{particlesOptions}}   
            />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        { this.state.route==='home'
        ?<div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm  onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box} />
          </div>
        :(
          this.state.route==='signin'
          ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        
        
      }
      </div>
    );
  }
}

export default App;


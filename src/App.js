/*global swal*/

import React, { Component } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';

//Gotta change this whenever you test
const apiToken = 'BQAsUNI5912fOCdHKYDEGRvm_WC4VsB0r1sFYqkfTKBqfTb15hFYc7eBiDte-I0TEbxOyjUPieewAUqo3jNrrikTnJhZD0073Y4EFMhLgHBPF_ggUYSg1X3SnhK3bUu8SpEZax_2jDi9KuB8oTyBYpY';





function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
}

class AlbumCover extends Component {
  render() {
    const src = this.props.track; // A changer ;)
    return (<img src={src} style={{ width: 400, height: 400 }} />);
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      text: "oi mah",
      tracks: [],
      songsLoaded: false,
      currentTrack: null
    }
  }


  componentDidMount(){
    this.setState({
      text: "Bonjour"
    });

    fetch('https://api.spotify.com/v1/me/tracks', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + apiToken,
      },
    })
    .then(response => response.json())
    .then((data) => {
      console.log("Reponse reçue ! Voilà ce que j'ai reçu : ", data);
      this.setState({
        text: "" + data.items.length,
        tracks: data.items,
        songsLoaded: true,
        currentTrack: data.items[getRandomNumber(data.items.length)],
        timeout: setTimeout(this.retry.bind(this), 30000)
      });
    })
  }
  
  retry() {
    const s = this.state;
    this.setState({
      currentTrack: s.tracks[getRandomNumber(s.tracks.length)],
      timeout: clearTimeout(s.timeout),
    })
    
    
    this.render()
    this.setState({timeout: setTimeout(this.retry.bind(this), 30000)})
  };

  checkAnswer(track) {
    if (track.track.id === this.state.currentTrack.track.id) {
      swal('Bravo !', 'Tu as gagné', 'success').then(this.retry.bind(this));
    } else {
      swal('Essaye encore', 'Ce n’est pas la bonne réponse', 'error');
    }
  }

  render() {
    if (this.state.songsLoaded) {  
      var i1 = getRandomNumber(this.state.tracks.length), i2 = getRandomNumber(this.state.tracks.length);
      while(i2 === i1)
        i2 = getRandomNumber(this.state.tracks.length);
      const flare1 = this.state.tracks[i1];
      const flare2 = this.state.tracks[i2];
      const target = this.state.currentTrack;
      const options = shuffleArray([target, flare1, flare2]);

      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h1 className="App-title">{this.state.text}</h1>
          </header>
          <div className="App-images">
            <AlbumCover track={this.state.tracks[0].track.album.images[0].url} />
          </div>
          <div className="App-Sound">
            <Sound url={target.track.preview_url} playStatus={Sound.status.PLAYING} />
          </div>
          <div className="App-buttons">
            {
              options.map(opaos => (
              <Button onClick={() => this.checkAnswer(opaos)}> {opaos.track.name}</Button>))
            }
            
          </div>
        </div>
      );
    }
    else{
      return(
        <div className="App">
          <header className="App-header">
            <img src={loading} className="App-loading" alt="loading"/>
          </header>

        </div>
      );
    }
  }
}

export default App;

import React from 'react';

import Tabs from './Tabs';

const ipc = electron.ipcRenderer;

class Music extends React.Component {
  constructor() {
    super();

    this.state = {
      artists: [],
      albums: [],
      songs: []
    };
  }
  componentWillMount() {
    ipc.send('fetchDB', 'music');
    ipc.on('fetchDBResults', (event, results) => {
      let newState = Object.assign(this.state, results);

      console.log(results);
      this.setState(newState);
    });
  }
  albumCount(id) {
    let filtered = this.state.albums.filter((al) => {
      return al.attributes.artist_id === id;
    });

    return filtered.length;
  }
  songCount(id) {
    let filtered = this.state.songs.filter((song) => {
      return song.attributes.artist_id === id;
    });

    return filtered.length;
  }
  render() {
    let self = this;
    let artists = this.state.artists.map((artist, index) => {
      return <li key={index}>{artist.attributes.name} <div className="song-details"><span>{self.albumCount.call(self, artist.attributes.id)}</span><i><img src="../public/images/cd.png"/></i><span>{self.songCount.call(this, artist.attributes.id)}</span><i className="fa fa-music"></i></div></li>;
    });
    return (
      <div id="music" className="view">
        <div id="artists"><ul className="media-list">{artists}</ul></div>
        <div id="albums"></div>
        <div id="songs"></div>
      </div>
    );
  }
}

export default Music;

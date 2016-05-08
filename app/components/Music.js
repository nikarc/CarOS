import React from 'react';

import Tabs from './Tabs';
import SideBar from './SideBar';

const ipc = electron.ipcRenderer;
const util = require('../util/util.js');

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
    let artists = this.state.artists.sort((a,b) => {return util.perfSort(a,b);}).map((artist, index) => {
      return <li key={index}>{artist.attributes.name} <div className="song-details"><span>{self.albumCount.call(self, artist.attributes.id)}</span><i><img src="../public/images/cd.png"/></i><span>{self.songCount.call(this, artist.attributes.id)}</span><i className="fa fa-music"></i></div></li>;
    });
    return (
      <div id="music" className="view">
        <SideBar options={['artists', 'albums', 'songs']}/>
        <div id="artists" className="view-pane"><ul className="media-list">{artists}</ul></div>
        <div id="albums" className="view-pane"></div>
        <div id="songs" className="view-pane"></div>
      </div>
    );
  }
}

export default Music;

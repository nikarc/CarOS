import React from 'react';

import Tabs from './Tabs';
import SideBar from './SideBar';

const ipc = electron.ipcRenderer;
const util = require('../util/util.js');
const _ = require('lodash');

class Music extends React.Component {
  constructor() {
    super();

    this.state = {
      artists: [],
      albums: [],
      songs: [],
      context: 'artists',
      media: {type: 'artists'}
    };

    this.changeContext = this.changeContext.bind(this);
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
  changeContext(context) {
    this.setState({context});
  }
  pickMedia(newMedia) {
    console.log(newMedia);
    this.setState({
      media: newMedia
    });
  }
  render() {
    let self = this;
    let artists = this.state.artists.sort((a,b) => {return util.perfSort(a,b);}).map((artist, index) => {
      return <li key={index} onClick={this.pickMedia.bind(this, {id: artist.attributes.id, type: 'albums'})}>{artist.attributes.name} <div className="song-details"><span>{self.albumCount.call(self, artist.attributes.id)}</span><i><img src="../public/images/cd.png"/></i><span>{self.songCount.call(this, artist.attributes.id)}</span><i className="fa fa-music"></i></div></li>;
    });
    let albums = _.sortBy(this.state.albums, (a) => { return a.attributes.year; }).map((album, index) => {
      return (
        <li key={index} onClick={this.pickMedia.bind(this, {id: album.attributes.id, type: 'songs'})}>
          <div className="album-art">
            <img src={album.attributes.image}/>
          </div>
          {album.attributes.name}
        </li>);
    });
    let songs = this.state.songs.sort((a,b) => { return a.attributes.title - b.attributes.title; }).map((song, index) => {
      return <li key={index}>{song.attributes.title} - {song.attributes.artist}</li>;
    });
    return (
      <div id="music" className="view">
        <SideBar options={['artists', 'albums', 'songs']} changeContext={this.changeContext} context={this.state.context} media={this.state.media} />
        <div className={'slide ' + this.state.media.type}>
          <div id="artists" className="view-pane"><ul className="media-list">{artists}</ul></div>
          <div id="albums" className="view-pane"><ul className="media-list">{albums}</ul></div>
          <div id="songs" className="view-pane"><ul className="media-list">{songs}</ul></div>
        </div>
      </div>
    );
  }
}

export default Music;

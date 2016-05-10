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
    this.mediaGoBack = this.mediaGoBack.bind(this);
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
    this.setState({
      media: newMedia
    });
  }
  mediaGoBack() {
    let newState = Object.assign(this.state.media, {type: 'artists'});
    this.setState(newState);
  }
  render() {
    let self = this;
    let artists = this.state.artists.sort((a,b) => {return util.perfSort(a,b);}).map((artist, index) => {
      return <li key={index} className="item-list" onClick={this.pickMedia.bind(this, {id: artist.attributes.id, type: 'albums', name: artist.attributes.name})}>
                <span>{artist.attributes.name}</span>
                <div className="song-details">
                  <div className="each">
                    <span>{self.albumCount.call(self, artist.attributes.id)}</span>
                    <i><img src="../public/images/cd.png"/></i></div><div className="each">
                    <span>{self.songCount.call(this, artist.attributes.id)}</span>
                    <i className="fa fa-music"></i>
                  </div>
                </div>
              </li>;
    });
    let albumSort = _.sortBy(this.state.albums, (a) => { return a.attributes.year; });
    let albums = _.filter(albumSort, (al) => { return al.attributes.artist_id === self.state.media.id; }).map((album, index) => {
      let songs = _.filter(_.sortBy(this.state.songs, (s) => { return s.attributes.track; }), (s) => { return s.attributes.album_id === album.attributes.id; }).map((song, songIndex) => {
        return  <li key={songIndex}>{songIndex + 1}  |  {song.attributes.title}</li>;
      });
      return (
        <li key={index} onClick={this.pickMedia.bind(this, {id: album.attributes.id, type: 'songs'})}>
          <div className="album-info">
            <div className="album-art">
              <img src={album.attributes.image}/>
            </div>
            <div>
              <h1>{this.state.media.name}</h1>
              <h3>{album.attributes.title}</h3>
            </div>
          </div>
          <ul className="album-songlist">{songs}</ul>
        </li>
      );
    });
    return (
      <div id="music" className="view">
        <SideBar options={['artists', 'albums', 'songs']} changeContext={this.changeContext} context={this.state.context} media={this.state.media} mediaGoBack={this.mediaGoBack} />
        <div className={'slide ' + this.state.media.type}>
          <div id="artists" className="view-pane"><ul className="media-list">{artists}</ul></div>
          <div id="albums" className="view-pane"><ul className="album-list">{albums}</ul></div>
        </div>
      </div>
    );
  }
}

export default Music;



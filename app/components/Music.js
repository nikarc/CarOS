import React from 'react';

import Tabs from './Tabs';
import SideBar from './SideBar';

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
        this.props.fetchDB.call(this, 'music');
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.artists || nextProps.albums || nextProps.songs) {
            this.setState({
                artists: nextProps.artists,
                albums: nextProps.albums,
                songs: nextProps.songs
            });
        }
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
        // WARN: if statement is a hack!
        // click event on all albums -> song click is bubbling up to parent which changes media type back to 'songs'
        // e.stopPropagation()'s not working
        if (this.state.media.type !== 'album-songs') {
            this.setState({
                media: newMedia,
                artistName: newMedia.name
            });
        }
    }
    mediaGoBack() {
        let newState = Object.assign(this.state.media, {type: 'artists'});
        this.setState(newState);
    }
    playSong(song, album) {
        window.mediaPlayer.playSong(song, album);
    }
    render() {
        let self = this;
        // all artists
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
        // artist albums or single album
        let albums = _.filter(_.sortBy(this.state.albums, (a) => { return a.attributes.year; }), (al) => { return al.attributes.artist_id === self.state.media.id || al.attributes.id === self.state.media.id; }).map((album, index) => {
            let artist = _.filter(self.state.artists, (ar) => { return ar.attributes.id === album.attributes.artist_id; });
            let songs = _.filter(_.sortBy(this.state.songs, (s) => { return s.attributes.track; }), (s) => { return s.attributes.album_id === album.attributes.id; }).map((song, songIndex) => {
                return  <li key={songIndex} onClick={this.playSong.bind(this, song.attributes, album.attributes)}>{songIndex + 1}  |  {song.attributes.title}</li>;
            });
            return (
                    <li key={index} onClick={this.pickMedia.bind(this, {id: album.attributes.id, type: 'songs'})}>
                        <div className="album-info">
                            <div className="album-art">
                                <img src={album.attributes.image}/>
                            </div>
                            <div>
                                <h1>{artist[0].attributes.name}</h1>
                                <h3>{album.attributes.title}</h3>
                            </div>
                        </div>
                        <ul className="album-songlist">{songs}</ul>
                    </li>
                );
        });

        // all albums
        let albumList = this.state.albums.map((al, albumIndex) => {
            let artist = _.filter(this.state.artists, (a) => { return a.attributes.id === al.attributes.artist_id; });
            return (
                    <li key={albumIndex} style={al.attributes.image.length > 0 ? {} : {display: 'none'}}>
                        <div className="all-album-art" onClick={this.pickMedia.bind(this, {id: al.attributes.id, type: 'album-songs', name: artist[0].attributes.name})}>
                            <img src={al.attributes.image} />
                        </div>
                    </li>
            );
        });

        // all songs
        let songSort = _.sortBy(this.state.songs, (s) => { return s.attributes.title; });
        let allSongs = songSort.map((song, index) => {
            let artist = _.filter(this.state.artists, (a) => { return a.attributes.id === song.attributes.artist_id; })[0];
            return (
                    <li key={index} className="item-list" onClick={this.playSong.bind(this, song.attributes)}><div>{song.attributes.title} - <small>{artist.attributes.name}</small></div></li>
            );
        });

        return (
                <div id="music" className="view">
                    <SideBar options={['artists', 'albums', 'songs']} changeContext={this.changeContext} context={this.state.context} media={this.state.media} mediaGoBack={this.mediaGoBack} />
                    {(function() {
                        if (this.state.context === 'artists') {
                            return (
                                    <div className={'slide ' + this.state.media.type}>
                                        <div id="artists" className="view-pane"><ul className="media-list">{artists}</ul></div>
                                            <div id="albums" className="view-pane"><ul className="album-list">{albums}</ul></div>
                                    </div>
                            );
                        }
                    }).call(this)}
                    {(function() {
                        if (this.state.context === 'albums') {
                            return (
                                    <div className={'slide ' + this.state.media.type}>
                                        <div id="all-albums" className="view-pane"><ul className="media-list">{albumList}</ul></div>
                                            <div id="all-albums-songs" className="view-pane">
                                                <ul className="album-list">{albums}</ul>
                                            </div>
                                        </div>
                            );
                        }
                    }).call(this)}
                    {(function() {
                        if (this.state.context === 'songs') {
                            return (
                                    <div className={'slide ' + this.state.media.type}>
                                        <div id="all-songs" className="view-pane">
                                            <ul className="media-list">
                                                {allSongs}
                                            </ul>
                                        </div>
                                    </div>
                            );
                        }
                    }).call(this)}
                </div>
        );
    }
}

export default Music;

// style={this.state.context === 'artists' ? {} : {display: 'none'}}
// style={this.state.context === 'album-songs' ? {display: 'none'} : {}}
// style={this.state.context === 'album-songs' ? {display: 'none'} : {}}


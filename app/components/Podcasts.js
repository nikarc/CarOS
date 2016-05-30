import React from 'react';

const _ = require('lodash');

class Podcasts extends React.Component {
    constructor() {
        super();

        this.state = {
            artists: [],
            albums: [],
            songs: [],
            currentPodcast: null,
            podcastDetail: false
        };

        this.goBack = this.goBack.bind(this);
    }
    componentWillMount() {
        this.props.fetchDB.call(this, 'podcasts');
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
    pickPodcast(artist) {
        this.setState({
            podcastDetail: true,
            currentPodcast: { artist, album: _.filter(this.state.albums, (al) => {  return al.attributes.artist_id === artist.attributes.id; })[0] }
        });
    }
    goBack() {
        this.setState({
            podcastDetail: false
        });

        setTimeout(() => {
            this.setState({
                currentPodcast: null
            });
        }, 300);
    }
    playSong(podcast) {
        window.mediaPlayer.playSong(podcast.attributes, 'podcasts');
    }
    render() {
        let self = this;
        let artists = this.state.artists.map((ar, index) => {
            let album = _.filter(self.state.albums, (al) => {  return ar.attributes.id === al.attributes.artist_id; })[0];

            return (<li className="each-podcast" key={index} onClick={this.pickPodcast.bind(this, ar)}>
                        <img src={album.attributes.image} />    
                        <div className="details">
                            <p>{ar.attributes.name}</p>
                            <p>{album.attributes.title}</p>
                        </div>
                    </li>);
        });
        return (
                <div id="podcasts" className={this.state.podcastDetail ? 'slide' : ''}>
                    <div id="all-podcasts">
                        <ul>
                            {artists}
                        </ul>
                    </div>
                    <div id="podcast-detail">
                        <div className="back-button" onClick={this.goBack}>
                            <i className="fa fa-chevron-left"></i>
                        </div>
                        {(function() {
                            if (this.state.currentPodcast) {
                                let podcasts = _.filter(self.state.songs, (s) => {  return s.attributes.artist_id === self.state.currentPodcast.artist.attributes.id; });
                                let list = podcasts.map((p, index) => {
                                    return (
                                        <li key={index} onClick={this.playSong.bind(this, p)}>{index + 1} - {p.attributes.title}</li>
                                    );
                                });
                                return (
                                    <div>
                                        <div className="chosen-details">
                                            <img src={this.state.currentPodcast.album.attributes.image} />
                                            <p>{this.state.currentPodcast.artist.attributes.name} - {this.state.currentPodcast.album.attributes.title}</p>
                                        </div>
                                        <ul id="podcast-list">
                                            {list}
                                        </ul>
                                    </div>
                                );
                            }
                        }).call(this)}
                    </div>
                </div>
            );
    }
}

export default Podcasts;

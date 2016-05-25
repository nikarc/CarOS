import React from 'react';

const _ = require('lodash');

class Podcasts extends React.Component {
    constructor() {
        super();

        this.state = {
            artists: [],
            albums: [],
            songs: [],
            currentPodcast: null
        };
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
            currentPodcast: { artist, album: _.filter(this.state.albums, (al) => {  return al.attributes.artist_id === artist.attributes.id; })[0] }
        });
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
                <div id="podcasts" className={this.state.currentPodcast ? 'slide' : ''}>
                    <div id="all-podcasts">
                        <ul>
                            {artists}
                        </ul>
                    </div>
                    <div id="podcast-detail">
                        <div className="back-button">
                            <i className="fa fa-chevron-left"></i>
                        </div>
                        {(function() {
                            if (this.state.currentPodcast) {
                                return (<div className="chosen-details">
                                            <img src={this.state.currentPodcast.album.attributes.image} />
                                            <p>{this.state.currentPodcast.artist.attributes.name} - {this.state.currentPodcast.album.attributes.title}</p>
                                        </div>);
                            }
                        }).call(this)}
                    </div>
                </div>
            );
    }
}

export default Podcasts;

const _ = require('lodash');

import EventEmitter from 'wolfy87-eventemitter';

// const ee = new EventEmitter();
console.log(ee);

module.exports = function(songs, albums, artists) {
    return {
        media: {
            songs: songs,
            albums: albums,
            artists: artists
        },
        songData: { 
            title: '',
            artist: '',
            length: 0,
            currentPos: 0
        },
        song: null,
        songList: [],
        play: function() {
            this.song.play();

            console.log('emitting event');
            ee.emitEvent('playing');
        },
        pause: function() {
            
        },
        next: function() {
            
        },
        previous: function() {
            
        },
        playSong: function(song, album) {
            this.song = new Audio(song.path);
            this.song.addEventListener('loadedmetadata', () => {
                this.songData = Object.assign(this.songData, song);
                this.songData.length = this.song.duration; 
            });

            this.play();

            // need to filter by array of songs from album ^
            this.songList = _.filter(_.sortBy(this.media.songs.slice(song.track), (sort) => { return sort.attributes.track; }), (s) => {
               return s.attributes.album_id === album.id; 
            });

            // console.log(this.songList);
        }
    };
};
const _ = require('lodash');

class MediaPlayerService {
    constructor(songs, albums, artists) {
        this.media = {
            songs: songs,
            albums: albums,
            artists: artists
        };
        this.songData = { 
            title: '',
            artist: '',
            length: 0,
            currentPos: 0
        };
        this.song = null;
        this.songList = [] ;
    }
    positionCounter() {
        if (this.songData.length > 0 && this.songData.currentPos !== this.songData.length) {
            this.songData.currentPos++;
            ee.emitEvent('position', [this.songData.currentPos]);

            setTimeout(() => {
                return this.positionCounter(); 
            }, 1000);
        }
    }
    play() {
        this.song.play();

        ee.emitEvent('playing');
    }
    pause() {

    }
    next() {

    }
    previous() {

    }
    scrub(pos) {
        this.song.currentTime = this.songData.currentPos = Math.round(this.songData.length * (parseInt(pos) * 0.01));

        ee.emitEvent('timeScrubbed', [this.song.currentTime]);
    }
    playSong(song, album) {
        this.song = new Audio(song.path);
        this.song.addEventListener('loadedmetadata', () => {
            this.songData = Object.assign(this.songData, song);
            this.songData.length = Math.floor(this.song.duration);
            ee.emitEvent('duration', [this.songData.length]);

            this.positionCounter();
        });

        this.play();

        // need to filter by array of songs from album ^
        this.songList = _.filter(_.sortBy(this.media.songs.slice(song.track), (sort) => { return sort.attributes.track; }), (s) => {
           return s.attributes.album_id === album.id; 
        });

        // console.log(this.songList);
    }
}

export default MediaPlayerService;

// module.exports = function(songs, albums, artists) {
//     return {
//         media: {
//             songs: songs,
//             albums: albums,
//             artists: artists
//         },
//         songData: { 
//             title: '',
//             artist: '',
//             length: 0,
//             currentPos: 0
//         },
//         song: null,
//         songList: [],
//         positionCounter: function() {
//             if (this.songData.length > 0 && this.songData.currentPos !== this.songData.length) {
//                 this.songData.currentPos++;
//                 ee.emitEvent('position', [this.songData.currentPos]);

//                 setTimeout(() => {
//                     return this.positionCounter(); 
//                 }, 1000);
//             }
//         },
//         play: function() {
//             this.song.play();

//             ee.emitEvent('playing');
//         },
//         pause: function() {
            
//         },
//         next: function() {
            
//         },
//         previous: function() {
            
//         },
//         scrub: function(pos) {
//             this.song.currentTime = this.songData.length * pos;
//         },
//         playSong: function(song, album) {
//             this.song = new Audio(song.path);
//             this.song.addEventListener('loadedmetadata', () => {
//                 this.songData = Object.assign(this.songData, song);
//                 this.songData.length = Math.floor(this.song.duration);
//                 ee.emitEvent('duration', [this.songData.length]);

//                 this.positionCounter();
//             });

//             this.play();

//             // need to filter by array of songs from album ^
//             this.songList = _.filter(_.sortBy(this.media.songs.slice(song.track), (sort) => { return sort.attributes.track; }), (s) => {
//                return s.attributes.album_id === album.id; 
//             });

//             // console.log(this.songList);
//         }
//     };
// };
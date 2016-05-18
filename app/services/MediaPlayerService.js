const _ = require('lodash');
let count = 0;

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
            album: null,
            length: 0,
            currentPos: 0,
            playing: false
        };
        this.song = null;
        this.songList = [] ;
        this.interval = null;
    }
    positionCounter() {
        if (this.songData.length > 0 && this.songData.currentPos !== this.songData.length && this.songData.playing) {
            this.interval = setInterval(() => {
                this.songData.currentPos++;
                ee.emitEvent('position', [this.songData.currentPos]);
            }, 1000);
        }
    }
    stopPositionCounter() {
        clearInterval(this.interval);
        this.interval = null;
    }
    play() {
        this.songData.playing = true;
        this.song.play();

        this.positionCounter();

        ee.emitEvent('playing', [true]);
    }
    pause() {
        this.song.pause();
        this.songData.playing = false;
        this.stopPositionCounter();
    }
    stop() {
        ee.emitEvent('playing', [false]);
        this.stopPositionCounter();
    }
    next() {
        let index = _.findIndex(this.songList, (sl) => {  return sl.attributes.title === this.songData.title; }) + 1;
        this.stopPositionCounter();
        this.playSong(this.songList[index].attributes);
    }
    previous() {
        let index = _.findIndex(this.songList, (sl) => {  return sl.attributes.title === this.songData.title; }) - 1;
        this.stopPositionCounter();
        this.playSong(this.songList[index].attributes);
    }
    scrub(pos) {
        this.song.currentTime = this.songData.currentPos = Math.round(this.songData.length * (parseInt(pos) * 0.01));

        ee.emitEvent('timeScrubbed', [this.song.currentTime]);
    }
    playSong(song, album) {

        if (!this.song) {
            this.song = new Audio(song.path);
        } else {
            this.song.src = song.path;
            this.song.load();
        }

        this.songData.artist = _.filter(this.media.artists, (a) => { return a.attributes.id === song.artist_id; })[0].attributes;
        this.songData.album = _.filter(this.media.albums, (a) => { return a.attributes.id === song.album_id; })[0].attributes;
        this.songData.title = song.title;

        this.song.addEventListener('loadedmetadata', () => {
            this.songData = Object.assign(this.songData, song);
            this.songData.length = Math.floor(this.song.duration);
            this.songData.track = song.track;
            ee.emitEvent('duration', [this.songData.length]);

            this.positionCounter();
        });

        ee.emitEvent('songData', [this.songData]);

        this.play();

        if (album) {
            this.songList = _.filter(_.sortBy(this.media.songs, (sort) => { return sort.attributes.track; }), (s) => {
               return s.attributes.album_id === album.id; 
            });
        }
    }
}

export default MediaPlayerService;
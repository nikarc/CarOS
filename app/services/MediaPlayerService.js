const _ = require('lodash');
const ipc = electron.ipcRenderer;

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
            playing: false,
            mediaType: '',
            id: null
        };
        this.song = null;
        this.songList = [] ;
        this.interval = null;
    }
    positionCounter() {
        let self = this;
        if (this.songData.length > 0 && this.songData.currentPos !== this.songData.length && this.songData.playing) {
            self.interval = setInterval(() => {
                this.songData.currentPos++;
                ee.emitEvent('position', [this.songData.currentPos]);
            }, 1000);

            // this.songData.currentPos++;
            // ee.emitEvent('position', [this.songData.currentPos]);
            // setTimeout(() => {
            //     this.positionCounter();
            // }, 1000);
        }
    }
    stopPositionCounter(reset, cb) {
        clearInterval(this.interval);
        if (reset) {
            this.songData.currentPos = 0;
        }

        if (typeof cb === 'function') {
            return cb();
        }
    }
    play() {
        this.songData.playing = true;
        this.song.play();

        // this.positionCounter();

        ee.emitEvent('playing', [true]);
    }
    pause() {
        if (this.songData.mediaType === 'podcasts') {
            ipc.send('savePlace', {pos: this.songData.currentPos, song: this.songData});
        }

        this.song.pause();
        this.songData.playing = false;
        this.stopPositionCounter(false);
    }
    stop() {
        ee.emitEvent('playing', [false]);
        this.stopPositionCounter(true);
    }
    next() {
        let index = _.findIndex(this.songList, (sl) => {  return sl.attributes.title === this.songData.title; }) + 1;
        this.stopPositionCounter(true, () => {
            this.playSong(this.songList[index].attributes); 
        });
    }
    previous() {
        let index = _.findIndex(this.songList, (sl) => {  return sl.attributes.title === this.songData.title; }) - 1;
        this.stopPositionCounter(true, () => {
            this.playSong(this.songList[index].attributes); 
        });
    }
    scrub(pos) {
        this.song.currentTime = this.songData.currentPos = Math.round(this.songData.length * (parseInt(pos) * 0.01));

        ee.emitEvent('timeScrubbed', [this.song.currentTime]);
    }
    playSong(song, album) {
        console.log(song);

        if (!this.song) {
            this.song = new Audio(song.path);
        } else {
            this.song.src = song.path;
            this.song.load();
        }

        if (!this.album) {
            this.songList = this.songs;
        }

        this.songData.id = song.id;
        this.songData.artist = _.filter(this.media.artists, (a) => { return a.attributes.id === song.artist_id; })[0].attributes;
        this.songData.album = _.filter(this.media.albums, (a) => { return a.attributes.id === song.album_id; })[0].attributes;
        this.songData.title = song.title;
        this.songData.mediaType = song.mediaType;

        if (song.currentPos) {
            this.song.currentTime = song.currentPos;
        }


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
            if (album === 'podcasts') {
                this.songList = _.filter(this.media.songs, (s) => {  return s.attributes.artist_id === song.artist_id; });
            } else {
                this.songList = _.filter(_.sortBy(this.media.songs, (sort) => { return sort.attributes.track; }), (s) => {
                    return s.attributes.album_id === album.id;
                });
            }
        }
    }
}

export default MediaPlayerService;
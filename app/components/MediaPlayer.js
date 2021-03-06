import React from 'react';

import InputRange from './InputRange';

import $ from 'jquery';


class MediaPlayer extends React.Component {
    constructor() {
        super();

        this.state = {
            currentPosition: 1,
            currentTime: 0,
            newPercentage: null,
            duration: 2,
            shouldChange: false,
            thumbPos: null,
            playing: false,
            songData: {artist: null, album: null},
            largePlayer: false
        };

        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.drag = this.drag.bind(this);
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.previous = this.previous.bind(this);
        this.next = this.next.bind(this);
        this.showLargePlayer = this.showLargePlayer.bind(this);
    }
    componentWillMount() {
        ee.addListener('position', (currentTime) => {
            let percentage = (currentTime / this.state.duration) * 100;
            this.setState({
                currentTime: currentTime,
                currentPosition: percentage + '%'
            });
        });

        ee.addListener('duration', (duration) => {
            this.setState({duration});
        });

        ee.addListener('timeScrubbed', (currentTime) => {
           this.setState({currentTime});
        });

        ee.addListener('playing', (playing) => {
           this.setState({playing});
        });

        ee.addListener('songData', (songData) => {
            console.log(songData);
           this.setState({songData});
        });
    }
    time(timeInSeconds) {
        let seconds = Math.floor(timeInSeconds % 60);
        let minutes = Math.floor(timeInSeconds / 60);
        return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }
    mouseDown() {
        this.state.shouldChange = true;
    }
    drag(e) {
        if (this.state.shouldChange) {
            let offset = $('#track').offset();
            let width = $('#track').width();

            let pos = e.pageX - offset.left;
            let percentage = (pos / width) * 100;
            if (pos < -9) {
                this.setState({
                    thumbPos: '-9px'
                });
            } else if (pos > (width - 9)) {
                this.setState({
                    thumbPos: (width - 9) + 'px'
                });
            } else {
                this.setState({
                    thumbPos: percentage + '%'
                });
            }

            this.setState({
                newPercentage: percentage
            });
        }
    }
    mouseUp(e) {
        console.log(e.target.parentNode);
        this.state.shouldChange = false;
        window.mediaPlayer.scrub(this.state.thumbPos);

        let time = Math.round(this.state.duration * (parseInt(this.state.thumbPos) * 0.01));
        this.setState({
                currentTime: time,
                currentPosition: this.state.newPercentage + '%'
            });
        this.state.thumbPos = null;
    }
    addTrackEvent() {
        let player = document.getElementById('mediaPlayer');
        player.addEventListener('mousemove', this.drag, false);
    }
    play() {
        window.mediaPlayer.play();
        this.setState({
            playing: true
        });
    }
    pause() {
        window.mediaPlayer.pause();
        this.setState({
            playing: false
        });
    }
    previous() {
        window.mediaPlayer.previous();
    }
    next() {
        window.mediaPlayer.next();
    }
    showLargePlayer() {
        this.setState({
            largePlayer: !this.state.largePlayer
        });
    }
    render() {
        let self = this;
        //  className={this.props.playing ? 'playing' : ''}
        return (
            <div id="mediaPlayer" style={this.state.largePlayer ? {height: '100%'} : {}}>
                <div id="small-player" className={this.props.playing ? 'playing' : ''}>
                    <div className="accent" style={{width: this.state.currentPosition}}></div>
                    <div className="wrap">
                        <div className="controls">
                            <div className="buttons">
                                <i className="fa fa-backward" onClick={this.previous}></i>
                                <i className="fa fa-play" style={this.state.playing ? {display: 'none'} : {}} onClick={this.play}></i>
                                <i className="fa fa-pause" style={this.state.playing ? {} : {display: 'none'}} onClick={this.pause}></i>
                                <i className="fa fa-forward" onClick={this.next}></i>
                            </div>
                        </div>
                        {(function() {
                            if (self.state.songData.artist) {
                                return (<div className="info">
                                            <div className="details">
                                                <span>{self.state.songData.title}</span>
                                                <span className="small">{self.state.songData.artist.name} &nbsp;-&nbsp; {self.state.songData.album.title}</span>
                                            </div>
                                            <div className="current-time">
                                                <span>{self.time(self.state.currentTime)}</span>
                                                <i className="fa fa-arrows-alt" onClick={self.showLargePlayer}></i>
                                            </div>
                                        </div>);
                            }
                        })()}
                    </div>
                </div>
                <div id="large-player" style={this.state.largePlayer ? {transform: 'translateY(0)'} : {display: 'none'}}>
                    <i className="fa fa-compress" onClick={this.showLargePlayer}></i>
                    {(function() {
                                if (self.state.songData.album) {
                                    return (
                                        <div id="album-info">
                                            <div className="background">
                                                <img src={self.state.songData.album.image} />;
                                            </div>
                                            <div className="info-block">
                                                <img src={self.state.songData.album.image} />
                                                <div className="details">
                                                    <span>{self.state.songData.title}</span><br/>
                                                    <span><small>{self.state.songData.artist.name} &nbsp;-&nbsp; {self.state.songData.album.title}</small></span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            })()}
                    <div className="controls">
                        <div className="buttons">
                            <i className="fa fa-backward" onClick={this.previous}></i>
                            <i className="fa fa-play" style={this.state.playing ? {display: 'none'} : {}} onClick={this.play}></i>
                            <i className="fa fa-pause" style={this.state.playing ? {} : {display: 'none'}} onClick={this.pause}></i>
                            <i className="fa fa-forward" onClick={this.next}></i>
                        </div>
                        <div id="scrubber" onMouseUp={this.mouseUp}>
                            <InputRange 
                                mouseUp={this.mouseUp}
                                drag={this.drag}
                                mouseDown={this.mouseDown}
                                addTrackEvent={this.addTrackEvent}
                                thumbPos={this.state.thumbPos}
                                currentPosition={this.state.currentPosition} />

                            <div id="times">
                                <div id="current-time">{this.time(this.state.currentTime)}</div>
                                <div id="end-time">{this.time(this.state.duration)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MediaPlayer;

// goes on scrubber
// {this.props.playing ? 'playing' : ''}
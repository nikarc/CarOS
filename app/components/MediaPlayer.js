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
            thumbPos: null
        };

        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.drag = this.drag.bind(this);
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
        // TODO: 
        // * figure out the time in seconds relative to thumb position in div
        // * pass time to media player to change position in song
        if (this.state.shouldChange) {
            let offset = $('#track').offset();
            let width = $('#track').width();

            let pos = e.pageX - offset.left;
            let percentage = (pos / width) * 100;
            console.log(percentage);
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
    mouseUp() {
        this.state.shouldChange = false;
        window.mediaPlayer.scrub(this.state.thumbPos);

        let time = Math.round(this.state.duration * (parseInt(this.state.thumbPos) * 0.01));
        console.log(time);
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
    render() {
        return (
            <div id="mediaPlayer" className="playing" onMouseUp={this.mouseUp}>
                <div id="controls">
                    <div id="buttons">
                        <i className="fa fa-backward"></i>
                        <i className="fa fa-play" style={this.props.playing ? {display: 'none'} : {}}></i>
                        <i className="fa fa-pause" style={this.props.playing ? {} : {display: 'none'}}></i>
                        <i className="fa fa-forward"></i>
                    </div>
                    <div id="scrubber">
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
        );
    }
}

export default MediaPlayer;

// goes on scrubber
// {this.props.playing ? 'playing' : ''}
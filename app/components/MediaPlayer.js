import React from 'react';

import InputRange from './InputRange';

import $ from 'jquery';

var count = 1;

class MediaPlayer extends React.Component {
    constructor() {
        super();

        this.state = {
            currentPosition: 1,
            duration: 2,
            shouldChange: false,
            thumbPos: 0
        };

        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.drag = this.drag.bind(this);
    }
    componentWillMount() {
        ee.addListener('position', (currentPosition) => {
            this.setState({currentPosition});
        });

        ee.addListener('duration', (duration) => {
            this.setState({duration});
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
            this.setState({
                thumbPos: e.pageX - offset.left
            });
        }
    }
    mouseUp() {
        console.log('should not change');
        this.state.shouldChange = false;
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
                            shouldChange={this.state.shouldChange}
                            thumbPos={this.state.thumbPos} />

                        <div id="times">
                            <div id="current-time">{this.time(this.state.currentPosition)}</div>
                            <div id="end-time">{this.time(this.state.duration)}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MediaPlayer;

// {this.props.playing ? 'playing' : ''}
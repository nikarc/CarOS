import React from 'react';

class MediaPlayer extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div id="mediaPlayer" className={this.props.playing ? 'playing' : ''}>
                <div id="controls">
                    <div id="buttons">
                        <i className="fa fa-backward"></i>
                        <i className="fa fa-play" style={this.props.playing ? {display: 'none'} : {}}></i>
                        <i className="fa fa-pause" style={this.props.playing ? {} : {display: 'none'}}></i>
                        <i className="fa fa-forward"></i>
                    </div>
                    <div id="scrubber">
                        <input type="range" defaultValue="0" />
                    </div>
                </div>
            </div>
        );
    }
}

export default MediaPlayer;
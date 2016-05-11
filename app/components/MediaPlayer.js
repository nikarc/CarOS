import React from 'react';

class MediaPlayer extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div id="mediaPlayer">
                <div id="controls">
                    <div id="buttons">
                        <i className="fa fa-backward"></i>
                        <i className="fa fa-play"></i>
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
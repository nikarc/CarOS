import React from 'react';
import $ from 'jquery';

class InputRange extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {
        this.props.addTrackEvent();
    }
    render() {
        return (
            <div className="input-range">
                <div className="input-range-track" id="track">
                    <div className="input-range-slider-thumb" style={{left: this.props.thumbPos}} onMouseDown={this.props.mouseDown}></div>
                </div>
            </div>
        );
    }
}

export default InputRange;
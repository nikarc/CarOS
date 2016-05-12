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
                    <div className="input-range-slider-thumb" style={this.props.thumbPos > 0 && this.props.thumbPos <= $('#track').width() ? {left: this.props.thumbPos + 'px'} : {}} onMouseDown={this.props.mouseDown}></div>
                </div>
            </div>
        );
    }
}

export default InputRange;
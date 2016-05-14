import React from 'react';
import $ from 'jquery';

class InputRange extends React.Component {
    constructor() {
        super();

        this.state = {
            currentPosition: 0
        };
    }
    componentDidMount() {
        this.props.addTrackEvent();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.thumbPos) {
            this.setState({
                currentPosition: nextProps.thumbPos
            });
        } else if (nextProps.currentPosition && !nextProps.thumbPos) {
            this.setState({
                currentPosition: nextProps.currentPosition
            });
        }
    }
    render() {
        return (
            <div className="input-range">
                <div className="input-range-track" id="track">
                    <div className="input-range-slider-thumb" style={{left: this.state.currentPosition}} onMouseDown={this.props.mouseDown}></div>
                </div>
            </div>
        );
    }
}

export default InputRange;
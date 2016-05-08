import React from 'react';

class SideBar extends React.Component {
    constructor() {
        super();

        this.state = {
            context: 'artists'
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.context.length > 0) {
            this.setState({
                context: nextProps.context
            });
        }
    }
    render() {
        let options = this.props.options.map((opt, index) => {
            let style;
            if (opt === 'artists') {
                style = 'fa-user';
            } else if (opt === 'albums') {
                style = 'cd';
            } else {
                style = 'fa-music';
            }
            return <li key={index} className={this.state.context === opt ? 'active' : ''} onClick={this.props.changeContext.bind(this, opt)}><i className={'fa ' + style}></i>{opt}</li>;
        });
        return (
            <div className="side-bar">
                <ul>
                    {options}
                    <li className="back-button" style={this.props.media.type === 'artists' ? {opacity: '0'} : {opacity: '1'}}>
                        <i className="fa fa-chevron-left"></i>
                        <span>Back</span>
                    </li>
                </ul>
            </div>
        );
    }
}

export default SideBar;
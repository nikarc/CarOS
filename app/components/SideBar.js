import React from 'react';

class SideBar extends React.Component {
    constructor() {
        super();
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
            return <li key={index}><i className={'fa ' + style}></i>{opt}</li>;
        });
        return (
            <div className="side-bar">
                <ul>
                    {options}
                </ul>
            </div>
        );
    }
}

export default SideBar;
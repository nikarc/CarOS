import React from 'react';
import { Link } from 'react-router';

import MediaPlayer from './MediaPlayer';

class Tabs extends React.Component {
    constructor() {
        super();

        this.state = {
            context: 'music'
        };

    }
    changeContext(context) {
        this.setState({context});
    }
    render() {
        return (
            <div id="tabs">
                <ul id="tabs-list" className={this.props.playing ? 'playing' : ''}>
                    <Link to={'/music'} onClick={this.changeContext.bind(this, 'music')}><li className={this.state.context === 'music' ? 'active' : ''}><i className="fa fa-music"></i><p>Music</p></li></Link>
                    <Link to={'/podcasts'} onClick={this.changeContext.bind(this, 'podcasts')}><li className={this.state.context === 'podcasts' ? 'active' : ''}><i className="fa fa-microphone"></i><p>Podcasts</p></li></Link>
                    <Link to={'/videos'} onClick={this.changeContext.bind(this, 'videos')}><li className={this.state.context === 'videos' ? 'active' : ''}><i className="fa fa-video-camera"></i><p>Videos</p></li></Link>
                    <Link to={'/settings'} onClick={this.changeContext.bind(this, 'settings')}><li className={this.state.context === 'settings' ? 'active' : ''}><i className="fa fa-cog"></i><p>Settings</p></li></Link>
                </ul>
            </div>
        );
    }
}

export default Tabs;

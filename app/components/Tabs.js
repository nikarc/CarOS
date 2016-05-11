import React from 'react';
import { Link } from 'react-router';

import MediaPlayer from './MediaPlayer';

class Tabs extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div id="tabs">
        <ul id="tabs-list">
          <Link to={'/music'}><li><div className="active"></div><i className="fa fa-music"></i><p>Music</p></li></Link>
          <Link to={'/podcasts'}><li><i className="fa fa-microphone"></i><p>Podcasts</p></li></Link>
          <Link to={'/videos'}><li><i className="fa fa-video-camera"></i><p>Videos</p></li></Link>
          <Link to={'/settings'}><li><i className="fa fa-cog"></i><p>Settings</p></li></Link>
        </ul>
        <MediaPlayer />
      </div>
    );
  }
}

export default Tabs;

import React from 'react';
import { Link } from 'react-router';

class Tabs extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div id="tabs">
        <ul>
          <Link to={'/music'}><li><div className="active"></div><i className="fa fa-music"></i><p>Music</p></li></Link>
          <Link to={'/podcasts'}><li><i className="fa fa-microphone"></i><p>Podcasts</p></li></Link>
          <Link to={'/videos'}><li><i className="fa fa-video-camera"></i><p>Videos</p></li></Link>
          <Link to={'/settings'}><li><i className="fa fa-cog"></i><p>Settings</p></li></Link>
        </ul>
      </div>
    );
  }
}

export default Tabs;

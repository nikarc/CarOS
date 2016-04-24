import React from 'react';
import moment from 'moment';

class MenuBar extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div id="MenuBar">
        <div className="time">
          {this.props.time}
        </div>
      </div>
    );
  }
}

export default MenuBar;

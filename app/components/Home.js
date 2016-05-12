import React from 'react';
import { hashHistory } from 'react-router';

import moment from 'moment';
import EventEmitter from 'wolfy87-eventemitter';

import Tabs from './Tabs';
import MenuBar from './MenuBar';

const ee = new EventEmitter();
window.ee = ee;

class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      time: null,
      timeInterval: null,
      playing: false
    };
  }
  componentWillMount() {
    let self = this;
    let interval = setInterval(() => {
      this.setState({
        time: moment().format('MMM Do YY - hh:mm a')
      });
    }, 1000);

    this.setState({
      timeInterval: interval
    });

    ee.addListener('playing', () => {
      console.log('song playing');
      self.setState({
        playing: true
      });
    });
  }
  render() {
    const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, { time: this.state.time }));
    return (
      <div id="home">
        <MenuBar time={this.state.time} />
        {childrenWithProps}
        <Tabs playing={this.state.playing} />
      </div>
    );
  }
}

export default Home;

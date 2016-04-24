import React from 'react';
import { hashHistory } from 'react-router';

import moment from 'moment';

import Tabs from './Tabs';
import MenuBar from './MenuBar';

class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      time: null,
      timeInterval: null
    };
  }
  componentWillMount() {
    // hashHistory.push('/music');

    let interval = setInterval(() => {
      this.setState({
        time: moment().format('MMM Do YY - hh:mm a')
      });
    }, 1000);

    this.setState({
      timeInterval: interval
    });
  }
  render() {
    const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, { time: this.state.time }));
    return (
      <div id="home">
        <MenuBar time={this.state.time} />
        {childrenWithProps}
        <Tabs />
      </div>
    );
  }
}

export default Home;

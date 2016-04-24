import React from 'react';
import { hashHistory } from 'react-router';

import Tabs from './Tabs';

class Home extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {
    hashHistory.push('/music');
  }
  render() {
    return (
      <div id="home">
        {this.props.children}
        <Tabs />
      </div>
    );
  }
}

export default Home;

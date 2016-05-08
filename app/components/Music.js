import React from 'react';

import Tabs from './Tabs';

const ipc = electron.ipcRenderer;

class Music extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {
    ipc.send('fetchDB', 'music');
    ipc.on('fetchDBResults', (event, results) => {
      console.log(results);
    });
  }
  render() {
    return (
      <div id="music">
        <h1>Music</h1>
      </div>
    );
  }
}

export default Music;

import React from 'react';

import Tabs from './Tabs';

const settings = require('../user_settings.json');
const ipc = electron.ipcRenderer;

class Settings extends React.Component {
  constructor() {
    super();

    this.showOpenDialog = this.showOpenDialog.bind(this);
  }
  showOpenDialog(context) {
    ipc.send('showOpenDialog', context);
  }
  render() {
    const media = settings.media.map((s, index) => {
      return (
        <div className="form-group" key={index}>
          <label htmlFor={s.name}>{s.name}:</label>
          <input type="text" name={s.name} className="each-media" defaultValue={s.path} placeholder={"/path/to/your/" + s.name} onClick={this.showOpenDialog.bind(this, s.name)} />
        </div>
      );
    });
    return (
      <div id="Settings" className="tab-view">
        <h1>Settings</h1>
        {media}
      </div>
    );
  }
}

export default Settings;

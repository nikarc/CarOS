import React from 'react';

import Tabs from './Tabs';

const settings = require('../../user_settings.json');
const ipc = electron.ipcRenderer;

class Settings extends React.Component {
  constructor() {
    super();

    this.state = {
      settings: settings,
      newSettings: {},
      loading: false,
      filePathsChanged: false,
      debugString: ''
    };

    this.showOpenDialog = this.showOpenDialog.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
  }
  showOpenDialog(context) {
    ipc.send('showOpenDialog', context);
    ipc.on('gotFilePaths', (event, doneObject) => {
      if (doneObject.length > 0) {
        this.setState({
          filePathsChanged: true
        });
      }

      let settingsObj = {};
      settingsObj[doneObject.context] = doneObject.filePaths;
      let newSettings = Object.assign(this.state.settings, settingsObj);
      console.log(newSettings);
      this.setState({ settings: newSettings });
    });
  }
  saveSettings() {
    let updateDB = false;

    if (this.state.filePathsChanged) {
      updateDB = true;
      this.setState({ loading: true });
    }
    ipc.send('saveSettings', updateDB);
    ipc.on('songSaved', (event, doneObj) => {
      this.state.debugString = doneObj.debugString;
      if (doneObj.done) {
        console.log('Done');
        this.setState({ loading: false });
      }
    });
  }
  render() {
    return (
      <div id="Settings" className="tab-view">
        <div id="saving-settings" style={this.state.loading ? {display: 'block'} : {display: 'none'}}>
          <div className="wrap">
            <h3>Saving Your Settings...</h3>
            <div className="sk-folding-cube">
              <div className="sk-cube1 sk-cube"></div>
              <div className="sk-cube2 sk-cube"></div>
              <div className="sk-cube4 sk-cube"></div>
              <div className="sk-cube3 sk-cube"></div>
            </div>
            <pre>{this.state.debugString}</pre>
          </div>
        </div>
        <h1><i className="fa fa-gear"></i>Settings</h1>
        <div className="form-group">
          <label htmlFor="music">Music:</label>
          <input type="text" name="music" className="each-media" defaultValue={this.state.settings.files.music} placeholder="/path/to/your/music" onClick={this.showOpenDialog.bind(this, 'music')} />
        </div>
        <div className="form-group">
          <label htmlFor="podcasts">Podcasts:</label>
          <input type="text" name="podcasts" className="each-media" defaultValue={this.state.settings.files.podcasts} placeholder="/path/to/your/podcasts" onClick={this.showOpenDialog.bind(this, 'podcasts')} />
        </div>
        <div className="form-group">
          <label htmlFor="videos">Videos:</label>
          <input type="text" name="videos" className="each-media" defaultValue={this.state.settings.files.videos} placeholder="/path/to/your/videos" onClick={this.showOpenDialog.bind(this, 'videos')} />
        </div>
        <button onClick={this.saveSettings}>Save Settings</button>
      </div>
    );
  }
}

export default Settings;

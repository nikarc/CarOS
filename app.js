'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const ipc = electron.ipcMain;
const dialog = require('dialog');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');

// services
const files = require('./services/files');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var config;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  if (process.platform !== 'linux') {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600
    });

    // check if config file
    let configPath = `${__dirname}/config.json`;
    fs.access(configPath, fs.F_OK, (err) => {
      if (err) {
        console.log(chalk.yellow('No config file, creating now...'));
        let config = {
          files: {
            music: [],
            podcasts: [],
            videos: []
          }
        };

        fs.writeFile(configPath, JSON.stringify(config, null, 4), (err) => {
          if (err) return console.error(err);

          config = require(configPath);
        });
      } else {
        config = require(configPath);
      }
    });

    mainWindow.webContents.openDevTools();
    mainWindow.loadURL(`file://${__dirname}/public/dev.html`);
  } else {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      kiosk: true
    });

    mainWindow.loadURL(`file://${__dirname}/public/index.html`);
  }

  ipc.on('showOpenDialog', (event, context) => {
    let defaultPath = `~/${context[0].toUpperCase()}${context.slice(1)}`;
    let filters = {
      music: [{ name: 'Music', extensions: ['mp3', 'ogg', 'wav'] }],
      videos: [{ name: 'Video', extensions: ['mp4', 'webm', 'ogv'] }],
      podcasts: [{ name: 'Podcast', extensions: ['mp3', 'ogg', 'wav'] }]
    };

    dialog.showOpenDialog(mainWindow, {
      title: 'Where are your files located?',
      defaultPath: defaultPath,
      filters: filters[context],
      properties: [
        'openDirectory',
        'multiSelections'
      ]
    }, (filePaths) => {
      files.updateUserSettings(filePaths, context);
    });
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

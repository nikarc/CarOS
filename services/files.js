const fs = require('fs');
const path = require('path');
const walk = require('walk');
const id3 = require('id3-parser');
const chalk = require('chalk');
const db = require('./database');

let walker;
let fileRegs = {
  movies: /\.(mp4|webm|oggv)$/,
  exclude: /(^\.)/
};
fileRegs.music = fileRegs.podcasts = /\.(mp3|wav|ogg)$/;

module.exports = {
  updateUserSettings: function(filePaths, context) {
    return new Promise((resolve, reject) => {
      let userSettings = require(carosRoot + '/user_settings.json');
      let newUserSettings = Object.assign(userSettings, {});

      if (filePaths) {
        filePaths.forEach((fp) => {
          newUserSettings.files[context] = fp;
        });

        fs.writeFile(carosRoot + '/user_settings.json', JSON.stringify(newUserSettings, null, 4), (err) => {
          if (err) return reject(err);

          resolve('done');
        });
      }
    });
  },
  updateDB: function() {
    return new Promise((resolve, reject) => {
        let filePaths = require(path.join(carosRoot, 'user_settings.json')).files;
        let fileCount = 0, savedCount = 0;

        for (let mediaType in filePaths) {
          walker = walk.walk(filePaths[mediaType]);

          walker.on('file', (root, fileStats, next) => {
            if (!fileRegs.exclude.test(fileStats.name)) {

              fileCount++;
              let songPath = path.resolve(root, fileStats.name);

              fs.readFile(songPath, (err, file) => {
                if (err) return reject('Error reading MP3 file: ' + err);

                id3.parse(file).then((tags) => {
                  if (tags && tags.artist && tags.album && tags.title) {
                    let debugString = `Attempting to save ${tags.artist} - ${tags.album}: ${tags.title}`;
                    console.log(chalk.yellow(debugString));
                    let imagePath = path.resolve(carosRoot, 'public', 'images', 'album_art', `${tags.artist} - ${tags.album}.jpg`);
                    let song = {
                      title: tags.title,
                      album: tags.album,
                      artist: tags.artist,
                      performer_sort: tags['performer-sort'] || tags.artist,
                      year: tags.year || 0,
                      image: imagePath,
                      mediaType: mediaType,
                      path: songPath,
                      track: /(\/)/.test(tags.track) ? tags.track.slice(0, tags.track.indexOf('/')) : tags.track
                    };

                    // create album art
                    // TODO: stop app from closing before completing album creation
                    if (tags.image && tags.image.data) {
                      fs.access(imagePath, fs.F_OK, (err) => {
                        if (err) {
                          let image = new Buffer(tags.image.data);
                          fs.writeFile(imagePath, image, (err) => {
                            if (err) return reject('Error creating album art: ' + err);
                          });
                        }
                      });
                    }

                    // save song to db
                    db.insertSong(song)
                      .then(() => {
                        savedCount++;
                        let done = false;

                        if (savedCount === fileCount) {
                          done = true;
                        }

                        resolve(debugString, done);
                      }).catch((err) => {
                        // if (err) console.log(err);
                      });
                  }
                });
              });
            }

            next();
          });

          walker.on('end', () => {
            resolve();
          });
        }
    });
  }
};







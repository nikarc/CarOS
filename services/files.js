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

        for (let mediaType in filePaths) {
          walker = walk.walk(filePaths[mediaType]);

          walker.on('file', (root, fileStats, next) => {
            if (!fileRegs.exclude.test(fileStats.name)) {
              let songPath = path.resolve(root, fileStats.name);

              if (!fileRegs.exclude.test(fileStats.name)) {
                fs.readFile(songPath, (err, file) => {
                  if (err) return reject('Error reading MP3 file: ' + err);

                  id3.parse(file).then((tags) => {
                    let imagePath = path.resolve(carosRoot, 'public', 'images', 'album_art', `${tags.artist} - ${tags.album}.jpg`);
                    if (tags) {
                      let song = {
                        title: tags.title,
                        album: tags.album,
                        artist: tags.artist,
                        performer_sort: tags['performer-sort'] || tags.artist,
                        year: tags.year || 0,
                        image: imagePath,
                        mediaType: mediaType,
                        track: /(\/)/.test(tags.track) ? tags.track.slice(0, tags.track.indexOf('/')) : tags.track
                      };

                      // create album art
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
                    }
                  });
                });
              }
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




// let fileCount = 0, savedCount = 0;
      // for (let mediaType in files) {
      //   walker = walk.walk(files[mediaType]);

      //   walker.on('file', (root, fileStats, next) => {
      //     fileCount++;
      //     let debugString = `Attempting to save ${fileStats.name}`;
      //     let filePath = path.join(root, fileStats.name);
      //     let splitFilePath = fileStats.name.split('/');
      //     console.log(chalk.yellow(debugString));
      //     if (fileRegs[mediaType].test(fileStats.name) && !fileRegs.exclude.test(splitFilePath[splitFilePath.length - 1])) {
      //       fs.readFile(filePath, (err, file) => {
      //         if (err) {
      //           console.error(chalk.yellow(err));
      //           return reject('Read song error: ' + err);
      //         } else {
      //           id3.parse(file).then((tags) => {
      //             if (tags) {
      //               let imagePath = `${carosRoot}/public/images/album_art/${tags.artist} - ${tags.album}.jpg`;

      //               var song = {
      //                 title: tags.title,
      //                 album: tags.album,
      //                 artist: tags.artist,
      //                 performer_sort: tags['performer-sort'] || tags.artist,
      //                 year: tags.year || 0,
      //                 image: imagePath,
      //                 mediaType: mediaType,
      //                 track: /(\/)/.test(tags.track) ? tags.track.slice(0, tags.track.indexOf('/')) : tags.track
      //               };

      //               // create image
      //               fs.access(imagePath, fs.F_OK, (err) => {
      //                 if (err) {
      //                   let image = new Buffer(tags.image.data);
      //                   fs.writeFile(imagePath, image, function(err) {
      //                     if (err) return reject('Write image error: ' + err);
      //                   });
      //                 }
      //               });

      //               // save song to db
      //               db.insertSong(song)
      //                 .then((result) => {
      //                   console.log('Db result: ', result);
      //                   savedCount++;
      //                   console.log(chalk.cyan(savedCount + ' ' + fileCount));
      //                   if (savedCount === fileCount) {
      //                     resolve(result, debugString, true);
      //                   } else {
      //                     resolve(result, debugString, false);
      //                   }
      //                 }).catch((err) => {
      //                   console.log('insert error: ', err);
      //                   reject(err);
      //                 });
      //             }
      //           });
      //         }
      //       })
      //     }

      //     next();
      //   });
      // }

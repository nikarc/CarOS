const fs = require('fs');
const walk = require('walk');
const id3 = require('id3-parser');
const chalk = require('chalk');

let walker;
let fileRegs = {};
fileRegs.music = fileRegs.podcasts = /\.(mp3|wav|ogg)$/;
fileRegs.movies = /\.(mp4|webm|oggv)$/;

module.exports = {
  updateUserSettings: function(filePaths, context) {
    return new Promise((resolve, reject) => {
      let userSettings = require(carosRoot + '/user_settings.json');
      let newUserSettings = Object.assign(userSettings, {});

      filePaths.forEach((fp) => {
        newUserSettings.files[context] = fp;
      });

      fs.writeFile(carosRoot + '/user_settings.json', JSON.stringify(newUserSettings, null, 4), (err) => {
        if (err) return reject(err);

        resolve('done');
      });
    });
  },
  updateDB: function() {
    return new Promise((resolve, reject) => {
      let files = require(carosRoot + '/user_settings.json')[files];
      for (let p in files) {
        walker = walk.walk(files[p]);

        walker.on('file', (root, fileStats, next) => {
          if (fileRegs[context].test(fileStats.name)) {
            fs.readFile(root + fileStats.name, (err, file) => {
              if (err) {
                return reject(err);
              } else {
                id3.parse(file).then((tags) => {
                  if (tags) {
                    let imagePath = `${carosRoot}/public/images/album_art/${tags.artist} - ${tags.album}.jpg`;

                    var song = {
                      title: tags.title,
                      album: tags.album,
                      artist: tags.artist,
                      performer_sort: tags['performer-sort'] || tags.artist,
                      year: tags.year,
                      image: imagePath,
                      track: /(\/)/.test(tags.track) ? tags.track.slice(0, tags.track.indexOf('/')) : tags.track
                    };

                    // create image

                    fs.access(imagePath, fs.F_OK, (err) => {
                      if (err) {
                        fs.writeFileSync(imagePath, new Buffer(tags.image.data), function(err) {
                          if (err) return reject(err);
                        });
                      }
                    });

                    // save song to db
                    console.log(song);
                  }
                });
              }
            })
          }
        });
      }
    });
  }
};

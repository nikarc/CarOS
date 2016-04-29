const fs = require('fs');
const walk = require('walk');
const id3 = require('id3-parser');

let walker;
let fileRegs = {};
fileRegs.music = fileRegs.podcasts = /\.(mp3|wav|ogg)$/;
fileRegs.movies = /\.(mp4|webm|oggv)$/;

module.exports = {
  updateUserSettings: function(filePaths, context) {
    return new Promise((resolve, reject) => {
      filePaths.forEach((filePath) => {
        walker = walk.walk(filePath);

        walker.on('file', (root, fileStats, next) => {
          if (fileRegs[context].test(fileStats.name)) {
            fs.readFile(root + fileStats.name, (err, file) => {
              if (err) {
                return reject(err);
              } else {
                id3.parse(file).then((tags) => {
                  if (tags) {
                    var song = {
                      title: tags.title,
                      album: tags.album,
                      artist: tags.artist,
                      performer_sort: tags['performer-sort'] || tags.artist,
                      year: tags.year,
                      image: tags.image.data,
                      track: /(\/)/.test(tags.track) ? tags.track.slice(0, tags.track.indexOf('/')) : tags.track
                    };

                    // create image
                    fs.writeFileSync('./public/images/album_art', new Buffer(song.image), function(err) {
                      if (err) return reject(err);
                    });

                    // save song to db
                  }
                });
              }
            })
          }
        });
      });
    });
  }
};

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const util = require('util');
const async = require('async');
const connString = 'postgres://caros1:caros@localhost/caros';
// const knex = require('pg');
const knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: './caros.db'
  }
});
const bookshelf = require('bookshelf')(knex);

var config = require(path.resolve(carosRoot, 'user_settings.json'));

// bookshelf
const Song = bookshelf.Model.extend({
  tableName: 'songs',
  artist: () => {
    return this.belongsTo(Artist);
  },
  album: () => {
    return this.belongsTo(Album);
  }
});

const Artist = bookshelf.Model.extend({
  tableName: 'artists',
  songs: () => {
    return this.hasMany(Song);
  },
  albums: () => {
    return this.hasMany(Album);
  },
  artist: () => {
    return this.belongsTo(Artist);
  }
});

const Album = bookshelf.Model.extend({
  tableName: 'albums',
  songs: () => {  
    return this.hasMany(Song);
  }
});

const isSetup = require(`${carosRoot}/user_settings.json`).database.is_setup;

let database = {
  setup: function() {
    // Setup db for first time
    knex.schema.createTableIfNotExists('artists', (table) => {
        table.increments('id').primary();
        table.string('name').unique();
        table.string('sort');
      }).createTableIfNotExists('albums', (table) => {
        table.increments('id').primary();
        table.string('title').unique();
        table.integer('year');
        table.string('image');
        table.integer('artist_id').references('artists.id');
      }).createTableIfNotExists('songs', (table) => {
        table.increments('id').primary();
        table.string('title');
        table.string('path');
        table.integer('track');
        table.integer('artist_id').references('artists.id');
        table.integer('album_id').references('albums.id');
      }).then(() => {
        
      }, (err) => {
        console.log(err);
      });
  },
  insertSong: function(song) {
    return new Promise((resolve, reject) => {
      let dupReg = /(duplicate key value violates unique constraint|already exists)/gi;

      let artist = new Artist({
        name: song.artist,
        sort: song.performer_sort
      });
      let album = new Album({
        title: song.album,
        year: parseInt(song.year),
        image: song.image
      });
      let songObj = new Song({
        path: song.path,
        title: song.title,
        track: parseInt(song.track)
      });
      // console.log(chalk.cyan(util.inspect(songObj, { showHidden: false, depth: null })));

      async.waterfall([
        (done) => {
          setTimeout(() => {
            artist.save().then((artistModel) => {
              done(null, artistModel);
            }).catch((err) => {
              if (dupReg.test(err)) {
                console.log('dupe');
              }
              console.log(chalk.red(err));
              done(null);
            });
          }, 300);
          
        },
        (artistModel, done) => {
          setTimeout(() => {
            album.save().then((albumModel) => {
              albumModel.set('artist_id', artistModel.id);
              albumModel.save();

              done(null, artistModel, albumModel);
            }).catch((err) => {
              if (dupReg.test(err)) {
                console.log('dupe');
              }
              console.log(chalk.red(err));
              done(null);
            });
          }, 300);
          
        },
        (artistModel, albumModel, done) => {
          setTimeout(() => {
            songObj.save().then((songModel) => {
              songModel.set('artist_id', artistModel.id);
              songModel.set('album_id', albumModel.id);

              songModel.save();

              done(null);
            }).catch((err) => {
              if (dupReg.test(err)) {
                console.log('dupe');
              }
              console.log(chalk.red(err));
              done(null);
            });
          }, 300);
          
        }
      ], (err) => {
        resolve();
      });
    });
  }
};

// check for and init db
database.setup();

module.exports = database;

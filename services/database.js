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
            table.integer('currentPos');
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

            let artist = {
                name: song.artist,
                sort: song.performer_sort,
                mediaType: song.mediaType
            };
            let album = {
                title: song.album,
                year: parseInt(song.year),
                image: song.image,
                mediaType: song.mediaType
            };
            let songObj = {
                path: song.path,
                title: song.title,
                track: parseInt(song.track),
                mediaType: song.mediaType,
                currentPos: 0
            };

            async.series([
                function(done) {
                    new Artist(artist).save().then(() => {
                        done(null);
                    }).catch((err) => {
                        done(null);
                    });
                },
                function(done) {
                    new Album(album).save().then((albumModel) => {
                        new Artist({ name: artist.name })
                        .fetch()
                        .then((artistModel) => {
                            albumModel.set('artist_id', artistModel.get('id'));
                            albumModel.save();

                            done(null);   
                        });
                    }).catch((err) => {
                        done(null);
                    });
                },
                function(done) {
                    new Song(songObj).save().then((songModel) => {
                        new Album({ title: album.title })
                        .fetch()
                        .then((albumModel) => {
                            new Artist()
                            .query({ where: { name: artist.name }})
                            .fetch()
                            .then((artistModel) => {
                                songModel.set('artist_id', artistModel.get('id'));
                                songModel.set('album_id', albumModel.get('id'));
                                songModel.save();
                            });

                            done(null);
                        });
                    }).catch((err) => {
                        done(null);
                    });
                }
            ], function(err) {
                resolve();
            });
        });
    },
    fetchDB: function(event, mediaType) {
        async.parallel([
            (done) => {
                new Artist()
                .query({ where: { mediaType: mediaType }})
                .fetchAll()
                .then((result) => {
                    done(null, result.models);
                }).catch((err) => {
                    done(err);
                });
            },
            (done) => {
                new Album()
                .query({ where: { mediaType: mediaType }})
                .fetchAll()
                .then((result) => {
                    done(null, result.models);
                }).catch((err) => {
                    done(err);
                });
            },
            (done) => {
                new Song()
                .query({ where: { mediaType: mediaType }})
                .fetchAll()
                .then((result) => {
                    done(null, result.models);
                }).catch((err) => {
                    done(err);
                });
            }
        ], (err, results) => {
            if (err) console.log(chalk.red(err));

            let media = {
                artists: results[0],
                albums: results[1],
                songs: results[2]
            };

            event.sender.send('fetchDBResults', media);
        });
    },
    savePlace: function(data) {
        new Song({id: data.song.id}).save({currentPos: data.pos}, {patch: true});
    }
};

// check for and init db
database.setup();

module.exports = database;

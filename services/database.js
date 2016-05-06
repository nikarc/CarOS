const chalk = require('chalk');
const fs = require('fs');
const connString = 'postgres://caros1:caros@localhost/caros';
// const pg = require('pg');
const pg = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'caros1',
    password: 'caros',
    database: 'caros'
  },
  // connection: connString,
  // searchPath: 'knex,public',
  debug: true
});

const isSetup = require(`${carosRoot}/user_settings.json`).database.is_setup;

let database = {
  init: function() {
    // Setup db for first time
    // TODO: this currently does nothing
    if (!isSetup) {
      console.log(chalk.yellow('Database not setup, creating now'));
      pg.schema.createTableIfNotExists('artists', (table) => {
        table.increments();
        table.string('name');
        table.string('sort_name');
      });

      pg.schema.createTableIfNotExists('albums', (table) => {
        table.increments();
        table.string('title');
        table.integer('year');
        table.string('image');
        table.string('artist');
        table.foreign('artist').references('artists');
      });

      pg.schema.createTableIfNotExists('songs', (table) => {
        table.increments();
        table.string('title');
        table.integer('track');
        table.string('artist');
        table.foreign('artist').references('artists');
        table.string('album');
        table.foreign('album').references('albums');
      });

      let user_settings = require(carosRoot + '/user_settings.json');
      user_settings.database.is_setup = true;

      fs.writeFileSync(carosRoot + '/user_settings.json', JSON.stringify(user_settings, null, 2));
    }
  },
  insertSong: function(song) {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}

database.init();

module.exports = database;

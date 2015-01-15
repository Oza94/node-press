/**
 * utility script to create an user in the database
 */

var mongoose = require('mongoose'),
  nconf      = require('nconf'),
  readline   = require('readline'),
  util       = require('util'),
  user       = {},
  rl         = null;

// setup nconf to use (in-order)
//  1. command-line arguments
//  2. environment variables
//  3. custom configuration file (./settings.json)
//  4. default configuration file (./settings.defaults.json)
nconf.argv()
    .env()
    .file({file: './settings.json'})
    .file({file: './settings.defaults.json'});

// require the user model schema
require('./../models/user');

rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function save() {
  var User = mongoose.model('User');

  var userModel = new User(user);

  userModel.save(function (err) {
    if (err) {
      console.error(err.message);

      begin();
    } else {
      console.log('success! user was created.');

      process.exit(0);
    }
  });
}

function askPassword() {
  rl.question('password: ', function (p1) {
    rl.question('password again: ', function (p2) {
      if (p1 !== p2) {
        console.error('error: password does not match');

        askPassword();
      } else {
        user.password = p1;

        save();
      }
    });
  });
}

function onEmail(email) {
  // input verification is handled by mongoose
  user.email = email;

  askPassword();
}

function onUsername(username) {
  // input verification is handled by mongoose
  user.username = username;

  rl.question('email: ', onEmail);
}

function begin() {
  rl.question('username: ', onUsername);
}

// create mongoose connection and begin
var dbUrl = util.format('mongodb://%s/%s', nconf.get('db:host'),
    nconf.get('db:name'));

mongoose.connect(dbUrl, function (err) {
  if (err) {
    console.error('mongoose: ' + err.message);
    console.error('fatal error, the application must shutdown');

    process.exit(1);
  } else {
    console.log('connected to database established ' + dbUrl);

    begin();
  }
});



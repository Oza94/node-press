var nconf   = require('nconf'),
    logger  = require('winston'),
    express = require('express'),
    parse5  = require('parse5'),
    xmlser  = require('xmlserializer'),
    dom     = require('xmldom').DOMParser,
    app     = null,
    User    = null,
    server  = null;

logger.remove(logger.transports.Console);

nconf.argv()
  .env()
  .file({file: './settings.defaults.json'});

nconf.set('db:name', nconf.get('db:name') + '-test');

exports.prepare = function (done) {
  app = express();

  require('./../config/mongoose')();    // configure and open mongo connection
  require('./../config/express')(app);  // configuration express application
  require('./../config/passport')(app); // configure authorization
  require('./../config/routes')(app);   // initialize express routes

  User = require('mongoose').model('User');

  server = app.listen(nconf.get('http:port'), nconf.get('http:host'), 511, done);

  return app;
};

exports.prepareTestUser = function (done) {
  var user = new User({
    username: 'test',
    password: 'test',
    email: 'test@mail.com'
  });

  user.save(done);

  return user;
};

exports.cleanup = function (done) {
  User.remove({}, function (err) {
    if (err) {
      throw err;
    }

    require('mongoose').disconnect();

    if (server) {
      server.close(done);
    } else {
      done();
    }
  });
};

exports.parse = function (htmlString) {
  var parser = new parse5.Parser();

  var document = parser.parse(htmlString);

  var xhtml = xmlser.serializeToString(document);

  return new dom().parseFromString(xhtml);
};
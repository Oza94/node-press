var nconf   = require('nconf'),
    logger  = require('winston'),
    express = require('express'),
    parse5  = require('parse5'),
    xmlser  = require('xmlserializer'),
    dom     = require('xmldom').DOMParser,
    app     = express(),
    server  = null;

exports.prepare = function (done) {
  nconf.argv()
    .env()
    .file({file: './settings.tests.json'})
    .file({file: './settings.defaults.json'});

  logger.remove(logger.transports.Console);

  require('./../config/mongoose')();    // configure and open mongo connection
  require('./../config/express')(app);  // configuration express application
  require('./../config/passport')(app); // configure authorization
  require('./../config/routes')(app);   // initialize express routes

  server = app.listen(nconf.get('http:port'), nconf.get('http:host'), 511, done);

  return app;
};

exports.cleanup = function (done) {
  if (server) {
    server.close(done);
  } else {
    done();
  }
};

exports.parse = function (htmlString) {
  var parser = new parse5.Parser();

  var document = parser.parse(htmlString);

  var xhtml = xmlser.serializeToString(document);

  return new dom().parseFromString(xhtml);
};
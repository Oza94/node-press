/**
 * entry point of the application
 */

var pkg     = require('./package.json'),
    nconf   = require('nconf'),
    logger  = require('winston'),
    express = require('express'),
    app     = express();

// setup nconf to use (in-order)
//  1. command-line arguments
//  2. environment variables
//  3. custom configuration file (./settings.json)
//  4. default configuration file (./settings.defaults.json)
nconf.argv()
    .env()
    .file({file: './settings.json'})
    .file({file: './settings.defaults.json'});

// remove default winston transport
logger.remove(logger.transports.Console);

if (nconf.get('logger:console')) {
  logger.add(logger.transports.Console, nconf.get('logger:console'));
}

// starts the server application
logger.info('starting %s@%s', pkg.name, pkg.version);

// require configuration scripts
require('./config/mongoose')();    // configure and open mongo connection
require('./config/express')(app);  // configuration express application
require('./config/passport')(app); // configure authorization
require('./config/routes')(app);   // initialize express routes

// starts listening for http requests
app.listen(nconf.get('http:port'), nconf.get('http:host'), 511, function () {
  logger.info('listening %s:%s', nconf.get('http:host'),
      nconf.get('http:port'));
});
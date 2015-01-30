
var nconf   = require('nconf'),
  mongoose  = require('mongoose'),
  util      = require('util'),
  fs        = require('fs'),
  logger    = require('winston');

/**
 * initialize mongoose
 */
module.exports = function (done) {
  // mongoose initialisation
  var dbUrl = util.format('mongodb://%s/%s', nconf.get('db:host'),
      nconf.get('db:name'));

  mongoose.connect(dbUrl, function (err) {
    if (err) {
      logger.error('mongoose:', err.message);
      logger.error('fatal error, the application must shutdown');

      process.exit(1);
    } else {
      logger.info('connected to database', dbUrl);
    }

    if (done) {
      done(err);
    }
  });

  // bootstrap models
  var models_path = __dirname + '/../models';

  fs.readdirSync(models_path).forEach(function (file) {
    require(models_path + '/' + file);
  });
};
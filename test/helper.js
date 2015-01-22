var nconf    = require('nconf'),
    fs       = require('fs'),
    async    = require('async'),
    logger   = require('winston'),
    express  = require('express'),
    request  = require('supertest'),
    app      = null,
    server   = null,
    opts     = null,
    testData = {},
    agent    = null,
    testUser = null;

logger.remove(logger.transports.Console); // mute logging during tests

exports.options = function (options) {
  opts = options;

  testData = {};
};

/** PREPARE helpers */

exports.prepare = function (options) {
  return function (done) {
    opts = options;

    if (!opts.testData) {
      opts.testData = {};
    }

    testData = {};

    var functions = [
      exports._prepareNconf
    ];

    if (opts.db || opts.http || opts.session) {
      functions.push(exports._prepareDb);
    }

    if (opts.http || opts.session) {
      functions.push(exports._prepareExpress);
    }

    if (opts.session) {
      functions.push(exports._prepareTestSession);
    }

    // setup test data
    for (var modelName in opts.testData) {
      if (opts.testData.hasOwnProperty(modelName)) {
        exports.setTestData(modelName, opts.testData[modelName]);
      }
    }

    async.series(functions, done);
  };
};

exports._prepareNconf = function (done) {
  nconf.argv()
      .env()
      .file({file: './settings.defaults.json'});

  nconf.set('db:name', nconf.get('db:name') + '-test');

  done();
};

exports._prepareDb = function (done) {
  require('./../config/mongoose')(function () {
    // bootstrap models
    var models_path = __dirname + '/../models';

    fs.readdirSync(models_path).forEach(function (file) {
      require(models_path + '/' + file);
    });

    if (opts.createDataOnPrepare) {
      exports.createTestData()(done);
    } else {
      done();
    }
  });
};

exports._prepareExpress = function (done) {
  app = express();

  require('./../config/express')(app);  // configuration express application
  require('./../config/passport')(app); // configure authorization
  require('./../config/routes')(app);   // initialize express routes

  server = app.listen(nconf.get('http:port'), nconf.get('http:host'), 511, done);
};

exports._prepareTestSession = function(done) {
  if (!testUser) {
    done();

    return null;
  }

  agent = request.agent(app);

  agent
    .post('/admin/login')
    .send({
      username: testUser.username,
      password: testUser.password
    })
    .end(done);

  return null;
};

/** CLEANUP helpers */

exports.cleanup = function () {
  return function (done) {
    var functions = [
      exports._cleanupNconf
    ];

    if (opts.db || opts.http) {
      functions.push(exports._cleanupDb);
    }

    if (opts.http) {
      functions.push(exports._cleanupExpress);
    }

    async.series(functions, done);
  };
};

exports._cleanupNconf = function (done) {
  nconf.reset();

  done();
};

exports._cleanupDb = function (done) {
  exports.deleteTestData()(function () {
    require('mongoose').disconnect(done);
  });
};

exports._cleanupExpress = function (done) {
  server.close(done);
};

/** UTILS **/

// return the express app
exports.getApp = function () {
  return app;
};

// inject data to db before tests
exports.setTestData = function (modelName, data) {
  if(typeof data !== 'array') {
    // if a single instance is given, convert to array
    data = [data];
  }

  if (!testData[modelName]) {
    testData[modelName] = data;
  } else {
    // merge arrays
    testData[modelName].push.apply(testData[modelName], data);
  }
};

/** created to clean/re-create test data before and after each test */

exports.createTestData = function () {
  return function(done) {
    if (testData._isCreated) {
      done();

      return null;
    }

    var functions = [], data, Model, modelInstance;

    for (var modelName in testData) {
      if (modelName !== '_isCreated' && testData.hasOwnProperty(modelName)) {
        data = testData[modelName];

        Model = require('mongoose').model(modelName);

        for (var i = 0; i < data.length; i += 1) {
          modelInstance = new Model(data[i]);

          functions.push(modelInstance.save.bind(modelInstance));

          // if this is the first User model instance, save it as the test user
          if (modelName === 'User' && i === 0) {
            testUser = modelInstance;
          }
        }
      }
    }

    async.parallel(functions, function (err) {
      if (err) {
        throw err;
      }

      testData._isCreated = true;

      done();
    });
  };
};

exports.deleteTestData = function () {
  return function(done) {
    var functions = [], model;

    for (var modelName in testData) {
      if (modelName !== '_isCreated' && testData.hasOwnProperty(modelName)) {
        model = require('mongoose').model(modelName);

        functions.push(function (done) {
          this.remove({}, done);
        }.bind(model));
      }
    }

    async.parallel(functions, function (err) {
      if (err) {
        throw err;
      }

      testData._isCreated = false;

      done();
    });
  };
};

exports.resetTestData = function (done) {
  exports.deleteTestData()(function () {
    testData = {};

    done();
  });
};

exports.getTestUser = function () {
  return testUser;
};

exports.getTestSession = function () {
  return agent;
};
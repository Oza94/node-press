
var nconf       = require('nconf'),
  passport      = require('passport'),
  logger        = require('winston'),
  express       = require('express'),
  flash         = require('connect-flash'),
  session       = require('express-session'),
  bodyParser    = require('body-parser'),
  cookieParser  = require('cookie-parser'),
  moment        = require('moment'),
  pkg           = require('./../package.json'),
  MongoStore    = require('connect-mongo')(session);

module.exports = function (app) {
  var appLocals = {};

  appLocals.theme = nconf.get('app:theme');
  appLocals.title = nconf.get('app:title');

  app.locals.app = appLocals;
  app.locals.pkg = pkg;
  app.locals.moment = moment;

  app.use(express.static('public'));

  app.set('view engine', 'jade');


  app.use(cookieParser());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.use(session({
    secret: nconf.get('session:secret'),
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      db: nconf.get('db:name')
    }),
    cookie: {
      maxAge: null
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());

  // routing logger
  app.use(function (req, res, next) {
    logger.verbose('%s %s', req.method, req.path);

    next();
  });

  // expose req object to views
  app.use(function (req, res, next) {
    res.locals.req = req;
    next();
  });
};
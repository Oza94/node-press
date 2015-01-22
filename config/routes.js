
var home         = require('./../controllers/home'),
  authentication = require('./../controllers/authentication'),
  articles       = require('./../controllers/articles');

module.exports = function (app) {
  // setup controllers routers
  app.use(home);
  app.use(articles);
  app.use(authentication);
};
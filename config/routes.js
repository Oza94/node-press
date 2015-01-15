
var passport     = require('passport'),
  auth           = require('./../middlewares/auth'),
  home           = require('./../controllers/home'),
  authentication = require('./../controllers/admin/authentication');
  articles       = require('./../controllers/admin/articles');

module.exports = function (app) {
  app.get('/', home.index);

  app.get('/admin/login', authentication.login);
  app.post('/admin/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true
  }));

  app.get('/admin/logout', auth.requireLogin, authentication.logout);
  app.get('/admin', auth.requireLogin, articles.home);

  app.get('/admin/news/new', auth.requireLogin, articles.edit);
  app.get('/admin/news/:slug', auth.requireLogin, articles.edit);
  app.post('/admin/news', auth.requireLogin, articles.save);

};
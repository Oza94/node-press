
var passport     = require('passport'),
  auth           = require('./../middlewares/auth'),
  home           = require('./../controllers/home'),
  authentication = require('./../controllers/admin/authentication'),
  articles  = require('./../controllers/articles'),
  adminArticles  = require('./../controllers/admin/articles');

module.exports = function (app) {
  app.get('/', home.index);

  app.get('/article/:slug', articles.view);

  app.get('/admin/login', authentication.login);
  app.post('/admin/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true
  }));

  app.get('/admin/logout', auth.requireLogin, authentication.logout);
  app.get('/admin', auth.requireLogin, adminArticles.home);

  app.get('/admin/news/new', auth.requireLogin, adminArticles.edit);
  app.get('/admin/news/:slug', auth.requireLogin, adminArticles.edit);
  app.post('/admin/news', auth.requireLogin, adminArticles.save);

};
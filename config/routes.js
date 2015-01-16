
var passport     = require('passport'),
  auth           = require('./../middlewares/auth'),
  home           = require('./../controllers/home'),
  authentication = require('./../controllers/authentication'),
  articles       = require('./../controllers/articles');

module.exports = function (app) {
  app.get('/', home.index);

  app.get('/drafts', auth.requireLogin, articles.drafts);
  app.get('/article/:slug', articles.view);
  app.get('/article/edit/new', auth.requireLogin, articles.edit);
  app.get('/article/edit/:slug', auth.requireLogin, articles.edit);
  app.post('/article/edit', auth.requireLogin, articles.save);


  app.get('/admin/login', authentication.login);
  app.post('/admin/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/admin/login',
    failureFlash: true
  }));
  app.get('/admin/logout', auth.requireLogin, authentication.logout);
};
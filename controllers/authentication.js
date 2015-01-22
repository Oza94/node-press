
var passport = require('passport'),
  express    = require('express'),
  auth       = require('./../middlewares/auth');

module.exports = (function () {
  var router = express.Router();

  router.route('/admin/login')
      .get(login)
      .post(passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/admin/login',
        failureFlash: true
      }));

  router.get('/admin/logout', auth.requireLogin, logout);

  return router;
})();

function login(req, res) {
  res.render('users/login');
}

function logout(req, res) {
  req.logout();

  res.redirect('/');
}

var authenticate = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/admin/login',
  failureFlash: true
});

exports.login = function (req, res) {
  res.render('users/login');
};

exports.logout = function (req, res) {
  req.logout();

  res.redirect('/');
};
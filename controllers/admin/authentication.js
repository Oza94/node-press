
exports.login = function (req, res) {
  res.render('admin/login');
};

exports.logout = function (req, res) {
  req.logout();

  res.redirect('/');
};

exports.protected = function (req, res) {
  res.render('admin/protected');
};

var mongoose = require('mongoose'),
    Article    = mongoose.model('Article');

exports.view = function (req, res) {
  Article.findOne({slug: req.params.slug}, function (err, article) {
    if (err) {
      throw err;
    }

    res.render('articles/view', {
      article: article
    });
  })
};
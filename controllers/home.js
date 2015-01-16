
var mongoose = require('mongoose'),
    Article    = mongoose.model('Article');

exports.index = function (req, res) {
  Article.find({})
    .sort('-createdAt')
    .exec(function (err, articles) {
      if (err) {
        throw err;
      }

      res.render('index', {
        articles: articles
      });
    });
};
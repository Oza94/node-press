
var mongoose = require('mongoose'),
    Article    = mongoose.model('Article');

exports.index = function (req, res) {
  var limit = req.query.per_page || 10,
    page    = req.query.page || 0,
    skip    = page * limit;

  Article.count({}, function (err, count) {
    if (err) {
      throw err;
    }

    Article.find({
      'published': true
    }).sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .exec(function (err, articles) {
        if (err) {
          throw err;
        }

        res.render('index', {
          articles: articles,
          page: page,
          pages: Math.ceil(count / limit)
        });
      });
  });
};
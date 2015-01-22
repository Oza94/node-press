
var mongoose = require('mongoose'),
  Article    = mongoose.model('Article'),
  passport   = require('passport'),
  express    = require('express'),
  auth       = require('./../middlewares/auth');

module.exports = (function () {
  var router = express.Router();

  router.get('/', index);

  return router;
})();

function index(req, res) {
  var limit = req.query.per_page || 10,
    page    = req.query.page || 0,
    skip    = page * limit;

  Article.count({}, function (err, count) {
    if (err) {
      throw err;
    }

    Article.find({
      'published': true
    }).sort('-publishAt')
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
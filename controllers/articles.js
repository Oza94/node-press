
var mongoose  = require('mongoose'),
  moment      = require('moment'),
  Article     = mongoose.model('Article'),
  passport    = require('passport'),
  express     = require('express'),
  auth        = require('./../middlewares/auth');

module.exports = (function () {
  var router = express.Router();

  router.get('/drafts', auth.requireLogin, drafts);
  router.get('/article/:slug', view);
  router.get('/article/edit/new', auth.requireLogin, edit);
  router.get('/article/edit/:slug', auth.requireLogin, edit);
  router.post('/article/edit', auth.requireLogin, save);

  return router;
})();

function view(req, res) {
  Article.findOne({slug: req.params.slug}, function (err, article) {
    if (err) {
      throw err;
    } else if (!article) {
      throw "Article not found";
    }

    res.render('articles/view', {
      article: article
    });
  });
}

function drafts(req, res) {
  Article.find({})
    .sort('-createdAt')
    .where('published').ne(true)
    .exec(function (err, articles) {
      if (err) {
        throw err;
      }

      res.render('articles/drafts', {
        articles: articles
      });
    });
}

function edit(req, res) {
  if (req.params.slug && req.params.slug !== '') {
    Article
      .findOne({slug: req.params.slug})
      .exec()
      .then(function(article) {
        for (var attribute in req.body) {
          if (article.hasOwnProperty(attribute)) {
            // No security
            article[attribute] = req.body[attribute];
          }
        }

        if (!article) {
          throw "No article found";
        }
        article.save();
        return article;
      })
      .then(function(article){
        res.render('articles/edit', {
          article: article
        });
      });
  } else {
    res.render('articles/edit');
  }
}

function save(req, res) {
  req.body.published = req.body.published === 'on';

  if ("_id" in req.body) {
    Article.findOne({_id: req.body._id})
      .exec()
      .then(function (article) {
        if (!article) {
          throw "Article not found";
        }

        article.title = req.body.title;
        article.content = req.body.content;
        article.published = req.body.published;
        if (article.published) {
          article.publishAt = moment().toDate();
        } else {
          article.publishAt = moment(req.body.publishAtDate + "T" +  req.body.publishAtTime).toDate();
        }
        return article;
      })
      .then(function(article){
        article.save(function (err) {
          if (err) {
            throw err;
          }
          res.redirect('/article/' + article.slug);
        });
      });
  } else {
    req.body.author = {
      id: req.user._id,
      username: req.user.username
    };

    Article
      .create(req.body)
      .then(function(article) {
        if (!article) {
          throw "No article found";
        }
        return article;
      })
      .then(function(article){
        article.save(function (err) {
          if (err) {
            throw err;
          }

        });
        return article;
      })
      .then(function(article){
        // In a .then because we have to wait the end of the save to read the slug.
        res.redirect('/article/' + article.slug);
      });
  }
}

exports.edit = edit;
exports.save = save;

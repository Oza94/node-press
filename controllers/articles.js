
var mongoose  = require('mongoose'),
    slug      = require('slugg'),
    Article   = mongoose.model('Article');

exports.view = function (req, res) {
  Article.findOne({slug: req.params.slug}, function (err, article) {
    if (err) {
      throw err;
    }

    res.render('articles/view', {
      article: article
    });
  });
};

exports.drafts = function (req, res) {
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
};

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // replace spaces with -
    .replace(/[^\w\-]+/g, '')       // remove all non-word chars
    .replace(/\-\-+/g, '-')         // replace multiple - with single -
    .replace(/^-+/, '')             // trim - from start of text
    .replace(/-+$/, '');            // trim - from end of text
}

function generateSlug(str, done) {

  var baseSlug  =  slug(str),
      slugz     = baseSlug,
      count     = 1;

  function checkSlugExists(err, article) {
    if (err) {
      throw err;
    } else if (article) {
      slugz = baseSlug + "." + count;
      count += 1;

      Article.findOne({slug: slugz}, checkSlugExists);
    } else {
      done(slugz);
    }
  }

  Article.findOne({slug: slugz}, checkSlugExists);
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
    generateSlug(req.body.title, function (slug) {
      req.body.slug = slug;

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
            res.redirect('/article/' + article.slug);
          });
        });
    });
  }
}

exports.edit = edit;
exports.save = save;

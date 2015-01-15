
var mongoose = require('mongoose'),
  Article    = mongoose.model('Article');

function home(req, res) {
  Article.find({}, function (err, articles) {
    if (err) {
      throw err;
    }

    res.render('admin/home', {
      articles: articles
    });
  })
}

function edit(req, res) {
  if (req.params.slug) {
    Article.findOne({
      slug: req.params.slug
    }, function (err, article) {
      if (err) {
        throw err;
      }

      res.render('admin/articles/edit', {
        article: article
      });
    });
  } else {
    res.render('admin/articles/edit');
  }
}

function slugify(text) {
  return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // replace spaces with -
      .replace(/[^\w\-]+/g, '')       // remove all non-word chars
      .replace(/\-\-+/g, '-')         // replace multiple - with single -
      .replace(/^-+/, '')             // trim - from start of text
      .replace(/-+$/, '');            // trim - from end of text
}

function generateSlug(str, done) {
  var baseSlug = slugify(str),
    slug       = baseSlug,
    counter    = 1;

  function cb(err, article) {
    if (err) {
      throw err;
    }

    if (article) {
      // slug already exists, try another one
      slug = baseSlug + '-' + (counter++);

      Article.findOne({slug: slug}, cb);
    } else {
      done(slug);
    }
  }

  Article.findOne({slug: slug}, cb);
}

function save(req, res) {
  if (req.body._id) {
    Article.findOne({_id: req.body._id}, function (err, article) {
      if (err) {
        throw err;
      }

      article.title = req.body.title;
      article.content = req.body.content;

      article.save(function (err) {
        if (err) {
          throw err;
        }

        res.redirect('/admin/');
      });
    });
  } else {
    generateSlug(req.body.title, function (slug) {
      req.body.slug = slug;

      var article = new Article(req.body);

      article.save(function (err) {
        if (err) {
          throw err;
        }

        res.redirect('/admin/');
      });
    });
  }
}

exports.home = home;
exports.edit = edit;
exports.save = save;

var mongoose    = require('mongoose'),
  queue         = {}, // The queue where timeOutId are stored
  timestamps    = require('mongoose-timestamp'),
  sanitizer     = require('sanitize-html'),
  slug          = require('slugg'),
  Promise       = require('bluebird'),
  moment        = require('moment'),
  marked        = require('marked');


var articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    required: true
  },
  compiled: {
    type: String
  },
  published: {
    type: Boolean,
    required: true,
    default: false
  },
  preview : {
    type: String,
    default : ""
  },
  createAt: {
    type: Date,
    default : Date.now,
    require: true
  },
  publishAt: {
    type: Date
  },
  author: {
    username : {
      type : String
    },
    id : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User",
      require: true
    }
  }
});


generateSlug = function (str, id, done) {
  var baseSlug  =  slug(str),
    slugz     = baseSlug,
    Article   = mongoose.model('Article'),
    count     = 1;

  function checkSlugExists(err, article) {
    if (article && article._id.toString() === id.toString()) {
      done(slugz);
    }
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
};

articleSchema.pre('save', function(next) {
  var article = this,
    timerId,
    timeToWait,
    re = new RegExp("<p>(.*?)</p>"),
    bodyOptions = {
      "allowedTags": [
        'b', 'i', 'em', 'strong', 'a', 'img', 'p', 'h1', 'h2', 'h3', 'h4',
        'h5', 'h6', 'ul', 'li', 'ol', 'pre'
      ],
      "allowedAttributes": {
        'a': [ 'href' ],
        'img': ['src', 'alt']
      }
    },
    previewOptions = {"allowedTags" : [], allowedAttributes: {}},
    result = [];
  if (article.content) {
    article.compiled = sanitizer((marked(article.content)), bodyOptions);
    result = re.exec(article.compiled);
    if (result) {
      article.preview = sanitizer((result[1].substring(0, 200)), previewOptions);
    }
  }

  // If article hasnt been published and got a publish date
  if (!article.published && article.publishAt) {
    // If publication was already scheduled, we clear the queue and schedule it again.
    if (queue[article._id]) {
      clearTimeout(queue[article._id]);
    }
    timeToWait = moment(article.publishAt).diff(moment());
    timerId = setTimeout(function(){
      article.published = true;
      article.save();
    }, timeToWait);
    queue[article._id] = timerId;
  }

  generateSlug(article.title, article._id, function(slug){
    if (article.slug !== slug)
    article.slug = slug;
    next();
  });


});


articleSchema.plugin(timestamps);

mongoose.model('Article', articleSchema);


var mongoose      = require('mongoose'),
  timestamps    = require('mongoose-timestamp'),
  sanitizer     = require('sanitize-html'),
  jobs          = require('../services/jobs'),
  marked        = require('marked');


var articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
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

articleSchema.pre('save', function(next) {
  var article = this,
    re = new RegExp("<p>(.*?)</p>"),
    options = {
      "allowedTags": [
        'b', 'i', 'em', 'strong', 'a', 'img', 'p', 'h1', 'h2', 'h3', 'h4',
        'h5', 'h6', 'ul', 'li', 'ol', 'pre'
      ],
      "allowedAttributes": {
        'a': [ 'href' ],
        'img': ['src', 'alt']
      }
    },
    result = [];
  if (article.content) {
    article.compiled = sanitizer((marked(article.content)), options);
    result = re.exec(article.compiled);
    if (result) {
      article.preview = result[1].substring(0, 200);
    }
  }

  // If article hasnt been published and got a publish date
  if (!article.published && article.publishAt) {
    console.log("Throwing job start");
    jobs
      .create('articlePublisher', {article: article})
      .save()
      .on('complete', function(result){
        // I Think the job has one main goal is to wait. And Say when he had wait enough
        // Then activate the change on db
        // Need to check if it doensnt block the saving doc

        mongoose.model('Article')
          .findOneAndUpdate({_id: article._id}, {published: true})
          .exec()
          .then(function(article){
            console.log(article, "job finished ! ", result);
          })
      })
      .on('failed', function(err){
        console.log("Job error ! ", err);
      });
  }

  next();
});


articleSchema.plugin(timestamps);

mongoose.model('Article', articleSchema);

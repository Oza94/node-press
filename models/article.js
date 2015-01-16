
var mongoose      = require('mongoose'),
    timestamps    = require('mongoose-timestamp'),
    Schema        = mongoose.Schema,
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
  }
});

articleSchema.pre('save', function(next) {
  var article = this;
  if (article.content) {
    article.compiled = marked(article.content);
  }

  next();
});

articleSchema.plugin(timestamps);

mongoose.model('Article', articleSchema);

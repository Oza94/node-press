
var mongoose      = require('mongoose'),
    timestamps    = require('mongoose-timestamp'),
    Schema        = mongoose.Schema;

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
  }
});

articleSchema.plugin(timestamps);

mongoose.model('Article', articleSchema);

/*global describe, it, before, after, beforeEach, afterEach */

var helper   = require('./../helper'),
    async    = require('async'),
    expect   = require('chai').expect,
    Article  = null,
    author   = null;

describe('article#model', function () {
  before(function (done) {
    async.series([
      helper.prepare({
        db: true,
        testData: {
          User: require('./../fixtures/test-user.json')
        }
      }),
      helper.createTestData(),
      function (done) {
        Article = require('mongoose').model('Article');

        var tmp = helper.getTestUser();

        author = {
          id: tmp._id,
          username: tmp.username
        };

        done();
      }
    ], done);
  });
  after(helper.cleanup());

  beforeEach(helper.createTestData());
  afterEach(helper.deleteTestData());

  it('should create an article', function (done) {
    var article = new Article({
      content: 'test',
      title: 'title',
      author: author
    });

    article.save(function (err, article) {
      if (err) throw err;

      done();
    });
  });
});
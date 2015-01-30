
/*global describe, it, before, after, beforeEach, afterEach */

var helper = require('./../helper'),
  async    = require('async'),
  expect   = require('chai').expect,
  User     = null;

describe('user#model', function () {
  before(helper.prepare({
    db: true,
    testData: {
      User: require('./../fixtures/test-user.json')
    }
  }));
  after(helper.cleanup());

  beforeEach(function () {
    User = require('mongoose').model('User');
  });
  afterEach(helper.deleteTestData());

  it('should create an user', function (done) {
    var user = new User({
      username: 'test',
      email: 'test@test.test',
      password: 'test'
    });

    user.save(function (err, user) {
      if (err) {
        throw err;
      }

      expect(user).to.exist();

      done();
    });
  });

  describe('authenticate()', function () {
    beforeEach(helper.createTestData());

    afterEach(helper.deleteTestData());

    it('should return true if password match', function () {
      var res = helper.getTestUser().authenticate('test');

      expect(res).to.be.equal(true);
    });

    it('should return false if password mismatch', function () {
      var res = helper.getTestUser().authenticate('false');

      expect(res).to.be.equal(false);
    });
  });
});
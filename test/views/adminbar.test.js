
/*global describe, before, after, it */

var helper = require('./../helper'),
  nconf    = require('nconf'),
  cheerio  = require('cheerio'),
  expect   = require('chai').expect,
  request  = require('supertest');

describe('adminbar#view', function () {
  before(helper.prepare({
    db: true,     // connect to a test database
    http: true,   // run express app
    session: true, // create a test session (already authenticated)
    createDataOnPrepare: true,
    testData: {
      User: require('./../fixtures/test-user.json')
    }
  }));

  after(helper.cleanup());

  it('should display the admin bar when logged in', function (done) {
    helper.getTestSession()
      .get('/')
      .expect(200)
      .end(function (err, res) {
        var $ = cheerio.load(res.text);

        // just check the page title
        expect($('div.admin')).to.exist();

        done();
      });
  });
});
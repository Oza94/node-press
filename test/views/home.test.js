
/*global describe, before, after, it */

var helper = require('./../helper'),
  nconf    = require('nconf'),
  cheerio  = require('cheerio'),
  expect   = require('chai').expect,
  request  = require('supertest');

describe('home#view', function () {
  before(helper.prepare({
    db: true,   // connect to a test database
    http: true  // run express app
  }));

  after(helper.cleanup());

  it('should load the home page', function (done) {
    request(helper.getApp())
      .get('/')
      .expect(200)
      .end(function (err, res) {
        var $ = cheerio.load(res.text);

        // just check the page title
        expect($('h1').text()).to.be.equal(nconf.get('app:title'));

        done();
      });
  });
});
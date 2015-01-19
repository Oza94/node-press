
/*global describe, it, after, before */

var server = require('./server'),
  app      = null,
  select   = null,
  nconf    = require('nconf'),
  request  = require('supertest'),
  xpath    = require('xpath'),
  expect   = require('chai').expect;

describe('server', function () {
  before(function (done) {
    app = server.prepare(done);

    select = xpath.useNamespaces({
      "x": "http://www.w3.org/1999/xhtml" // html namespace
    });
  });

  after(function (done) {
    server.cleanup(done);
  });

  it('should open the home page', function (done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        var doc = server.parse(res.text);

        // test if page title is present
        expect(select('//x:h1/x:a', doc).length).to.be.equal(1);

        // test if page title content is the one defined in configuration
        expect(select('//x:h1/x:a/text()', doc).toString())
            .to.be.equal(nconf.get('app:title'));

        done();
      });
  });

  it('should open the login page', function (done) {
    request(app)
      .get('/admin/login')
      .expect(200)
      .end(function (err, res) {
        var doc = server.parse(res.text);

        // test if page title is present
        expect(select('//x:h1', doc).length).to.be.equal(1);

        // test if page title is login
        expect(select('//x:h1/text()', doc).toString())
            .to.be.equal('login');

        // test if login form exists
        expect(select('//x:form[@action="/admin/login"]', doc).length)
            .to.be.equal(1);

        // test if there is an username field
        expect(select('//x:input[@name="username"]', doc).length)
            .to.be.equal(1);

        // login should not use global template, check that no footer is present
        expect(select('//x:footer', doc).length)
            .to.be.equal(0);

        done();
      });
  });
});
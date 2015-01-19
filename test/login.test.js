
/*global describe, it, after, before */

var server = require('./server'),
  app      = null,
  user     = null,
  select   = null,
  nconf    = require('nconf'),
  request  = require('supertest'),
  agent    = null,
  xpath    = require('xpath'),
  expect   = require('chai').expect;

describe('login', function () {
  before(function (done) {
    app = server.prepare(function () {
      user = server.prepareTestUser(done);
    });

    agent = request.agent(app);

    select = xpath.useNamespaces({
      "x": "http://www.w3.org/1999/xhtml" // html namespace
    });
  });

  after(function (done) {
    server.cleanup(done);
  });

  it('should redirect to login page when failing', function (done) {
    request(app)
      .post('/admin/login')
      .send({
        username: 'fake',
        password: 'fake'
      })
      .expect(200)
      .end(function (err, res) {
        expect(res.header.location).to.be.equal('/admin/login');

        done();
      });
  });

  it('should login an user', function (done) {
    agent
      .post('/admin/login')
      .send({
        username: user.username,
        password: user.password
      })
      .expect(200)
      .end(function (err, res) {
        expect(res.header.location).to.be.equal('/');

        done();
      });
  });

  it('should display admin bar when logged in', function (done) {
    agent
      .get('/')
      .expect(200)
      .end(function (err, res) {
        var doc = server.parse(res.text),
          adminBarPath = '//x:div[contains(@class, "admin")]';

        // test if page admin bar is present
        expect(select(adminBarPath, doc).length).to.be.equal(1);

        // test if logout link is present
        expect(select('//x:a[@href="/admin/logout"]', doc).length).to.be.equal(1);

        done();
      });
  });
});
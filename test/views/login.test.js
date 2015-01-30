
/*global describe, before, after, it, afterEach, beforeEach */

var helper = require('./../helper'),
    nconf    = require('nconf'),
    cheerio  = require('cheerio'),
    expect   = require('chai').expect,
    request  = require('supertest');

describe('login#view', function () {
  before(helper.prepare({
    db: true,     // connect to a test database
    http: true,   // run express app
    testData: {
      User: require('./../fixtures/test-user.json')
    }
  }));
  after(helper.cleanup());

  beforeEach(helper.createTestData());
  afterEach(helper.deleteTestData());

  it('should load the login page', function (done) {
    request(helper.getApp())
        .get('/admin/login')
        .expect(200)
        .end(function (err, res) {
          var $ = cheerio.load(res.text),
            $form = $('form');

          expect($form).to.exist();

          expect($form.attr('action')).to.be.equal('/admin/login');

          expect($form.find('input[name="username"]')).to.exist();
          expect($form.find('input[name="password"]')).to.exist();

          done();
        });
  });

  it('should redirect to login page when login fails', function (done) {
    request(helper.getApp())
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

  it('should redirect to home page when login is successful', function (done) {
    var user = helper.getTestUser();

    request(helper.getApp())
      .post('/admin/login')
      .send({
        username: user.username,
        password: 'test'
      })
      .expect(200)
      .end(function (err, res) {
        expect(res.header.location).to.be.equal('/');

        done();
      });
  });
});
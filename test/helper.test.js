
/*global describe, it */

var helper = require('./helper'),
  async    = require('async'),
  expect   = require('chai').expect,
  request  = require('supertest'),
  mongoose = require('mongoose');

describe('test-helper', function () {
  describe('#prepare', function () {
    it('should prepare the database', function (done) {
      helper.prepare({db: true})(function () {
        expect(mongoose.Connection.STATES.connected)
            .to.be.equal(mongoose.connection.readyState);

        helper.cleanup()(done);
      });
    });

    it('should prepare the express app', function (done) {
      helper.prepare({http: true})(function () {
        request(helper.getApp()).get('/').expect(200)
          .end(function (err, res) {
            if (err) throw err;

            helper.cleanup()(done);
          });
      });
    });

    it('should prepare a test user', function (done) {
      var options = {
        db: true,
        testData: {
          User: require('./fixtures/test-user.json')
        }
      };

      async.series([
        helper.prepare(options),
        helper.createTestData()
      ], function () {
        expect(helper.getTestUser())
          .to.exist();

        async.series([
          helper.deleteTestData(),
          helper.cleanup()
        ], function () {
          done();
        });
      });
    });
  });

  describe('#cleanup', function () {
    it('should clear the database', function (done) {
      helper.prepare({db: true})(function () {
        expect(mongoose.Connection.STATES.connected)
            .to.be.equal(mongoose.connection.readyState);

        helper.cleanup()(function () {
          expect(mongoose.Connection.STATES.connected)
              .to.be.not.equal(mongoose.connection.readyState);

          mongoose.disconnect(done);
        });
      });
    });

    it('should stop the express app', function (done) {
      helper.prepare({http: true})(function () {
        helper.cleanup()(function () {
          try {
            request(helper.getApp())
                .get('/')
                .timeout(1000)
                .end(function (err, res) {
                  expect(err).to.exist();

                  done();
                });
          } catch (err) {
            done();
          }
        });
      });
    });
  });
});
const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  test('Convert valid input (10L)', done => {
    chai.request(server).get('/api/convert?input=10L').end((err, res) => {
      assert.equal(res.status, 200);
      assert.equal(res.body.initNum, 10);
      assert.equal(res.body.initUnit, 'L');
      done();
    });
  });
  test('Convert invalid input (32g)', done => {
    chai.request(server).get('/api/convert?input=32g').end((err, res) => {
      assert.equal(res.body.error, 'invalid unit');
      done();
    });
  });
  test('Convert invalid number (3/7.2/4kg)', done => {
    chai.request(server).get('/api/convert?input=3/7.2/4kg').end((err, res) => {
      assert.equal(res.body.error, 'invalid number');
      done();
    });
  });
  test('Convert invalid number and unit (3/7.2/4kilomegagram)', done => {
    chai.request(server).get('/api/convert?input=3/7.2/4kilomegagram').end((err, res) => {
      assert.equal(res.body.error, 'invalid number and unit');
      done();
    });
  });
  test('Convert with no number (kg)', done => {
    chai.request(server).get('/api/convert?input=kg').end((err, res) => {
      assert.equal(res.body.initNum, 1);
      assert.equal(res.body.initUnit, 'kg');
      done();
    });
  });
});

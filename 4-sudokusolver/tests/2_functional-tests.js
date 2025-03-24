const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: puzzlesAndSolutions[0][0] })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.property(res.body, 'solution');
        assert.strictEqual(res.body.solution, puzzlesAndSolutions[0][1]);
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.deepEqual(res.body, { error: 'Required field missing' });
        done();
      });
  });

  test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: 'AA5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5..' })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '999999999999999999999999999999999999999999999999999999999999999999999999999999999' })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
        done();
      });
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A1', value: '3' })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.property(res.body, 'valid');
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'C7', value: '5' })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.deepEqual(res.body.conflict, ['row']);
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'F7', value: '3' })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.deepEqual(res.body.conflict.sort(), ['row', 'column'].sort());
        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A1', value: '2' })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.deepEqual(res.body.conflict.sort(), ['row', 'column', 'region'].sort());
        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({})
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.deepEqual(res.body, { error: 'Required field(s) missing' });
        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: 'AA5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A1', value: '3' })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });
  // Check a puzzle placement with incorrect length: POST request to /api/check
  test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: `${puzzlesAndSolutions[0][0]}12353`, coordinate: 'A1', value: '3' })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      });
    });

    // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'Z1', value: '3' })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid coordinate' });
          done();
        });
      });
    // Check a puzzle placement with invalid placement value: POST request to /api/check
    test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A1', value: '31325' })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid value' });
          done();
        });
      });
});

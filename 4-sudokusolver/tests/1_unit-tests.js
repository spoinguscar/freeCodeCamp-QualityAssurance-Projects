const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
let solver = new Solver();

suite('Unit Tests', () => {
  
  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.strictEqual(solver.validate(puzzlesAndSolutions[0][0]), true);
  });

  test('Logic handles a puzzle string with invalid characters', () => {
    const puzzle = 'A..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    assert.deepEqual(solver.validate(puzzle), { error: 'Invalid characters in puzzle' });
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3353';
    assert.deepEqual(solver.validate(puzzle), { error: 'Expected puzzle to be 81 characters long' });
  });

  test('Logic handles a valid row placement', () => {
    assert.isTrue(solver.checkRowPlacement(puzzlesAndSolutions[1][0], 0, 2, '8'));
  });

  test('Logic handles an invalid row placement', () => {
    assert.isFalse(solver.checkRowPlacement(puzzlesAndSolutions[1][0], 0, 2, '5'));
  });

  test('Logic handles a valid column placement', () => {
    assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[1][0], 1, 1, '4'));
  });

  test('Logic handles an invalid column placement', () => {
    assert.isFalse(solver.checkColPlacement(puzzlesAndSolutions[1][0], 2, 0, '5'));
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.isTrue(solver.checkRegionPlacement(puzzlesAndSolutions[1][0], 1, 1, '4'));
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    assert.isFalse(solver.checkRegionPlacement(puzzlesAndSolutions[1][0], 1, 1, '5'));
  });

  test('Valid puzzle strings pass the solver', () => {
    const solution = solver.solve(puzzlesAndSolutions[2][0]);
    assert.property(solution, 'solution');
    assert.strictEqual(solution.solution.length, 81);
  });

  test('Invalid puzzle strings fail the solver', () => {
    const puzzle = '53..7....6..195...98..A.6..8...6...34..8.3..17...2...6..6....28...419..5....8..79';
    assert.deepEqual(solver.solve(puzzle), { error: 'Invalid characters in puzzle' });
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const solution = solver.solve(puzzlesAndSolutions[3][0]);
    assert.strictEqual(solution.solution, puzzlesAndSolutions[3][1]);
  });
});

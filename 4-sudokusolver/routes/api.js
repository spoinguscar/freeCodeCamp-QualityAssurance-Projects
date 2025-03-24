'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      

      const row = coordinate[0].toUpperCase().charCodeAt(0) - 65;
      const column = parseInt(coordinate.slice(1)) - 1;

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      if (!/^[A-I][1-9]$/.test(coordinate.toUpperCase())) {
        return res.json({ error: 'Invalid coordinate' });
      }

      const validation = solver.validate(puzzle);
      if (validation.error) {
        return res.json(validation);
      }

      // Check if value is already placed at that coordinate
      if (puzzle[row * 9 + column] === value) {
        return res.json({ valid: true });
      }

      let conflicts = [];
      if (!solver.checkRowPlacement(puzzle, row, column, value)) conflicts.push('row');
      if (!solver.checkColPlacement(puzzle, row, column, value)) conflicts.push('column');
      if (!solver.checkRegionPlacement(puzzle, row, column, value)) conflicts.push('region');

      if (conflicts.length) {
        return res.json({ valid: false, conflict: conflicts });
      }

      return res.json({ valid: true });
    });


  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const validation = solver.validate(puzzle);
      if (validation.error) {
        return res.json(validation);
      }

      const solution = solver.solve(puzzle);
      if (solution.error) {
        return res.json(solution);
      }

      return res.json({ solution: solution.solution });
    });
};

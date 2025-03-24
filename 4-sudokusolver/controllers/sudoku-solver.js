class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) return { error: 'Required field missing' };
    if (puzzleString.length !== 81) return { error: 'Expected puzzle to be 81 characters long' };
    if (/[^1-9.]/.test(puzzleString)) return { error: 'Invalid characters in puzzle' };
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const grid = this.convertToGrid(puzzleString);
    return !grid[row].includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const grid = this.convertToGrid(puzzleString);
    return !grid.some(r => r[column] === value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const grid = this.convertToGrid(puzzleString);
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (grid[startRow + r][startCol + c] === value) {
          return false;
        }
      }
    }
    return true;
  }
  isValidPuzzle(puzzleString) {
    const grid = this.convertToGrid(puzzleString);
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = grid[row][col];
        if (value !== '.') {
          grid[row][col] = '.';
          let tempPuzzleString = this.convertToString(grid);
          if (!this.checkRowPlacement(tempPuzzleString, row, col, value) ||
            !this.checkColPlacement(tempPuzzleString, row, col, value) ||
            !this.checkRegionPlacement(tempPuzzleString, row, col, value)) {
            return false;
          }
          grid[row][col] = value;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (validation !== true) return validation;
    if (!this.isValidPuzzle(puzzleString)) return { error: 'Puzzle cannot be solved' };
    let grid = this.convertToGrid(puzzleString);
    if (!this.backtrack(grid)) return { error: 'Puzzle cannot be solved' };
    return { solution: this.convertToString(grid) };
  }

  convertToGrid(puzzleString) {
    return puzzleString.match(/.{9}/g).map(row => row.split(''));
  }

  convertToString(grid) {
    return grid.map(row => row.join('')).join('');
  }

  backtrack(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === '.') {
          for (let num = 1; num <= 9; num++) {
            let val = num.toString();
            if (this.checkRowPlacement(grid.flat().join(''), row, col, val) &&
              this.checkColPlacement(grid.flat().join(''), row, col, val) &&
              this.checkRegionPlacement(grid.flat().join(''), row, col, val)) {
              grid[row][col] = val;
              if (this.backtrack(grid)) return true;
              grid[row][col] = '.';
            }
          }
          return false;
        }
      }
    }
    return true;
  }
}

module.exports = SudokuSolver;

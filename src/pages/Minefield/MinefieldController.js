class Minefield {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;

    this.minefield = new Array(rows);
    for (let i = 0; i < rows; i++) {
      this.minefield[i] = new Array(columns);
    }

    this.states = {
      UNTOUCHED: 0,
      MINE: 1,
      FLARE: 2,
      CLEAR: 3,
      MARKED: 4,
    };

    this.playerIsAlive = true;
    this.isGameOver = false;

    this.currentScore = 0;
    this.totalScore = this.rows * this.columns;

    this.setMines();
    this.setFlares();
  }

  setMines = () => {
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        const minePresenceOdds = Math.round(100 * Math.random());
        if (minePresenceOdds <= 85) {
          this.minefield[row][column] = this.states.UNTOUCHED;
        } else {
          this.minefield[row][column] = this.states.MINE;
        }
      }
    }
  };

  setFlares = () => {
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        const minePresenceOdds = Math.round(100 * Math.random());
        if (
          minePresenceOdds <= 15 &&
          this.minefield[row][column] !== this.states.MINE
        ) {
          this.minefield[row][column] = this.states.FLARE;
        }
      }
    }
  };

  checkGameStatus = () => {
    if (!this.playerIsAlive || this.currentScore >= this.columns * this.rows) {
      this.isGameOver = true;
      return false;
    } else {
      return true;
    }
  };

  step = (row, column) => {
    const matrix = JSON.parse(JSON.stringify(this.minefield));
    const rows = this.rows;
    const columns = this.columns;

    // Helper function to check if a position is valid and within bounds
    const isValidPosition = (row, column) => {
      return row >= 0 && row < rows && column >= 0 && column < columns;
    };

    // Helper function to update a position to the specified state
    const updatePosition = (row, column, state) => {
      if (isValidPosition(row, column)) {
        matrix[row][column] = state;
      }
    };

    // Clear or mark adjacent positions based on flare
    const clearOrMarkAdjacentPositions = (row, column) => {
      const adjacentPositions = [
        { row: row - 1, column: column - 1 }, // Top left
        { row: row - 1, column }, // Up
        { row: row - 1, column: column + 1 }, // Top right
        { row, column: column - 1 }, // Left
        { row, column: column + 1 }, // Right
        { row: row + 1, column: column - 1 }, // Bottom left
        { row: row + 1, column }, // Down
        { row: row + 1, column: column + 1 }, // Bottom right
      ];

      adjacentPositions.forEach((position) => {
        const { row, column } = position;
        if (isValidPosition(row, column)) {
          const state = matrix[row][column];
          if (state === this.states.UNTOUCHED) {
            updatePosition(row, column, this.states.CLEAR); // Clear untouched position
          } else if (state === this.states.MINE) {
            updatePosition(row, column, this.states.MARKED); // Mark adjacent mine
          }
        }
      });
    };

    // Check if the current position is valid and untouched or a flare
    if (
      isValidPosition(row, column) &&
      (matrix[row][column] === this.states.UNTOUCHED ||
        matrix[row][column] === this.states.FLARE)
    ) {
      if (matrix[row][column] === this.states.FLARE) {
        clearOrMarkAdjacentPositions(row, column); // Clear or mark adjacent positions
      }
      matrix[row][column] = this.states.CLEAR; // Change untouched or flare to clear
      this.currentScore += 1;
    } else if (
      isValidPosition(row, column) &&
      matrix[row][column] === this.states.MINE
    ) {
      this.playerIsAlive = false;
    }

    this.minefield = matrix;

    // Check game status
    if (!this.playerIsAlive || this.currentScore >= this.totalScore) {
      this.isGameOver = true;
    }
  };

  mark = (x, y) => {
    if (this.minefield[x][y] === this.states.MINE) {
      this.minefield[x][y] = this.states.MARKED;
    }
  };

  calculateNearestMine = (entryRow, entryColumn) => {
    const matrix = this.minefield;
    const rows = this.rows;
    const columns = this.columns;

    // Helper function to calculate the number of slots separating two positions
    const calculateSlots = (row1, column1, row2, column2) => {
      const dx = Math.abs(column1 - column2);
      const dy = Math.abs(row1 - row2);
      return Math.max(dx, dy);
    };

    let minSlots = Infinity;

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        if (matrix[row][column] === this.states.MINE) {
          const slots = calculateSlots(entryRow, entryColumn, row, column);
          minSlots = Math.min(minSlots, slots);
        }
      }
    }

    return minSlots;
  };
}

export { Minefield };

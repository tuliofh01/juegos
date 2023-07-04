class Minefield {
 
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;

    this.minefield = new Array(rows);
    for (let i = 0; i < rows; i++) {
      this.minefield[i] = new Array(columns);
    }

    this.distanceArray = new Array(rows);
    for (let i = 0; i < rows; i++) {
      this.distanceArray[i] = new Array(columns);
    }

    // Cell states
    this.states = {
      UNTOUCHED: 0,
      MINE: 1,
      FLARE: 2,
      CLEAR: 3,
      MARKED: 4,
      NUMBERED: 5,
      SUCCESSFULLY_MARKED: 6,
    };

    this.playerIsAlive = true;
    this.isGameOver = false;

    this.currentScore = 0;
    this.totalScore = this.rows * this.columns;

    this.setMines();
    this.setFlares();
  }

  // Randomly adds mines to the minefield
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

  // Randomly adds flares to the minefield
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

  // Checks game status (used to end the game)
  checkGameStatus = () => {
    if (!this.playerIsAlive || this.getMinesCount() === 0) {
      this.isGameOver = true;
      return false;
    } else {
      return true;
    }
  };

  // Counts mines (used to end the game)
  getMinesCount = () => {
    let minesCount = 0;
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        if (this.minefield[row][column] === this.states.MINE) {
          minesCount++;
        }
      }
    }
    return minesCount;
  };

  // Conditionally updates games status
  checkGameOver = () => {
    if (!this.playerIsAlive || this.getMinesCount() === 0) {
      this.isGameOver = true;
    }
  }

  // Processes a click in the minefield
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
            // Clear untouched position
            updatePosition(row, column, this.states.CLEAR);
          } else if (state === this.states.MINE) {
            // Mark adjacent mine
            updatePosition(row, column, this.states.SUCCESSFULLY_MARKED);
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
        // Clear or mark adjacent positions
        clearOrMarkAdjacentPositions(row, column);
      }
      // Change untouched or flare to clear
      matrix[row][column] = this.states.CLEAR;
      this.currentScore += 1;
    } else if (
      isValidPosition(row, column) &&
      matrix[row][column] === this.states.MINE
    ) {
      this.playerIsAlive = false;
    }

    this.minefield = matrix;

    // Check game status
    this.checkGameOver();
  };

  // Marks target cell
  mark = (x, y) => {
    if (this.minefield[x][y] === this.states.MINE) {
      this.minefield[x][y] = this.states.SUCCESSFULLY_MARKED;
    } else {
      this.minefield[x][y] = this.states.MARKED;
    }
    this.checkGameOver()
  };

  // Unmarks target cell
  unmark = (x, y) => {
    if (this.minefield[x][y] === this.states.MARKED) {
      this.minefield[x][y] = this.states.UNTOUCHED;
    } else if (this.minefield[x][y] === this.states.SUCCESSFULLY_MARKED) {
      this.minefield[x][y] = this.states.MINE;
    }
    this.checkGameOver();
  };

  // Generates mine distance value
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
        if (
          matrix[row][column] === this.states.MINE ||
          matrix[row][column] === this.states.SUCCESSFULLY_MARKED
        ) {
          const slots = calculateSlots(entryRow, entryColumn, row, column);
          minSlots = Math.min(minSlots, slots);
        }
      }
    }

    return minSlots === Infinity ? 0 : minSlots;
  };
}

export { Minefield };

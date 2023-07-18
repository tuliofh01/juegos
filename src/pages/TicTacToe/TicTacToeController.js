class TicTacToeController {
  constructor() {
    this.states = {
      EMPTY: 0,
      X: 1,
      O: 2,
    };

    this.board = [
      [this.states.EMPTY, this.states.EMPTY, this.states.EMPTY],
      [this.states.EMPTY, this.states.EMPTY, this.states.EMPTY],
      [this.states.EMPTY, this.states.EMPTY, this.states.EMPTY],
    ];

    this.isGameOver = false;
  }

  checkWin = () => {
    const { board, states } = this;

    // Check rows
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] === states.X &&
        board[i][1] === states.X &&
        board[i][2] === states.X
      ) {
        return states.X; // Player (X) has won
      }
      if (
        board[i][0] === states.O &&
        board[i][1] === states.O &&
        board[i][2] === states.O
      ) {
        return states.O; // Adversary (O) has won
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] === states.X &&
        board[1][i] === states.X &&
        board[2][i] === states.X
      ) {
        return states.X; // Player (X) has won
      }
      if (
        board[0][i] === states.O &&
        board[1][i] === states.O &&
        board[2][i] === states.O
      ) {
        return states.O; // Adversary (O) has won
      }
    }

    // Check diagonals
    if (
      (board[0][0] === states.X &&
        board[1][1] === states.X &&
        board[2][2] === states.X) ||
      (board[0][2] === states.X &&
        board[1][1] === states.X &&
        board[2][0] === states.X)
    ) {
      return states.X; // Player (X) has won
    }

    if (
      (board[0][0] === states.O &&
        board[1][1] === states.O &&
        board[2][2] === states.O) ||
      (board[0][2] === states.O &&
        board[1][1] === states.O &&
        board[2][0] === states.O)
    ) {
      return states.O; // Adversary (O) has won
    }

    return null; // No winner
  };

  adversaryPlay = () => {
    if (this.isGameOver) {
      return;
    }

    const availableMoves = [];

    // Find available moves
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] === this.states.EMPTY) {
          availableMoves.push([i, j]);
        }
      }
    }

    // Check if the adversary can win in the next move
    for (const move of availableMoves) {
      const [row, col] = move;
      this.board[row][col] = this.states.O;

      if (this.checkWin()) {
        this.isGameOver = true;
        return;
      }

      this.board[row][col] = this.states.EMPTY;
    }

    // Check if the player can win in the next move and block them
    for (const move of availableMoves) {
      const [row, col] = move;
      this.board[row][col] = this.states.X;

      if (this.checkWin()) {
        this.board[row][col] = this.states.O;
        this.isGameOver = this.checkWin();
        return;
      }

      this.board[row][col] = this.states.EMPTY;
    }

    // If no winning move, play to generate a draw
    let drawMove = null;
    for (const move of availableMoves) {
      const [row, col] = move;
      this.board[row][col] = this.states.O;
      const isDraw = this.checkDraw();
      this.board[row][col] = this.states.EMPTY;

      if (isDraw) {
        drawMove = move;
        break;
      }
    }

    if (drawMove) {
      const [row, col] = drawMove;
      this.board[row][col] = this.states.O;
    } else {
      // If no draw move, make a random move
      const randomMove =
        availableMoves[Math.floor(Math.random() * availableMoves.length)];
      const [row, col] = randomMove;
      this.board[row][col] = this.states.O;
    }

    this.isGameOver = this.checkWin();
  };

  checkDraw = () => {
    const { board, states } = this;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === states.EMPTY) {
          return false; // There is an empty cell, not a draw
        }
      }
    }

    return true; // All cells are filled, it's a draw
  };
}

export default TicTacToeController;
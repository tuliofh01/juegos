class SnakeController {
  constructor() {
    // Cell states
    this.states = {
      EMPTY: 0,
      WALL: 1,
      FOOD: 2,
      HEAD: 3,
      BODY: 4,
    };

    // Determines the game's status
    this.isGameOver = false;

    // Determines the size of the snake
    this.snakeSize = 0;

    // Creates board matrix with boundaries
    this.board = [];
    const boardSize = 50;

    // Create the top boundary
    const topBoundary = Array(boardSize).fill(this.states.WALL);
    this.board.push(topBoundary);

    // Create the middle rows with side boundaries
    for (let i = 1; i < boardSize - 1; i++) {
      const row = [];
      row.push(this.states.WALL); // left boundary

      for (let j = 1; j < boardSize - 1; j++) {
        row.push(this.states.EMPTY);
      }

      row.push(this.states.WALL); // right boundary
      this.board.push(row);
    }

    // Create the bottom boundary
    const bottomBoundary = Array(boardSize).fill(this.states.WALL);
    this.board.push(bottomBoundary);

    // Initial position and direction of the snake
    this.snake = [];
    this.direction = {
      x: 1,
      y: 0,
    };
    this.head = {
      x: 25,
      y: 25,
    };
    this.snake.push(this.head);

    // Spawn initial food
    this.spawnFood();
  }

  // Spawns food at a random position
  spawnFood = () => {
    let x = null;
    let y = null;
    while (x === null && y === null) {
      x = Math.trunc(50 * Math.random());
      y = Math.trunc(50 * Math.random());

      while (
        this.board[y][x] === this.states.WALL ||
        this.board[y][x] === this.states.BODY ||
        this.board[y][x] === this.states.HEAD
      ) {
        x = Math.trunc(50 * Math.random());
        y = Math.trunc(50 * Math.random());
      }
    }
    this.board[y][x] = this.states.FOOD;
  };

  // Updates the snake's movement and checks for food or collisions
  iterate = (direction) => {
    // Update snake's direction based on the input
    if (direction === "up" && this.direction.y !== 1) {
      this.direction = { x: 0, y: -1 };
    } else if (direction === "down" && this.direction.y !== -1) {
      this.direction = { x: 0, y: 1 };
    } else if (direction === "left" && this.direction.x !== 1) {
      this.direction = { x: -1, y: 0 };
    } else if (direction === "right" && this.direction.x !== -1) {
      this.direction = { x: 1, y: 0 };
    }

    // Calculate new head position
    const newHead = {
      x: this.head.x + this.direction.x,
      y: this.head.y + this.direction.y,
    };

    // Check if the new head position has reached food
    if (this.board[newHead.y][newHead.x] === this.states.FOOD) {
      // Increase snake size and spawn new food
      this.snakeSize++;
      this.spawnFood();
    } else {
      // Remove tail if not reaching food
      if (this.snake.length > this.snakeSize) {
        const tail = this.snake.shift();
        this.board[tail.y][tail.x] = this.states.EMPTY;
      }
    }

    // Check if the new head position is valid
    if (
      this.board[newHead.y][newHead.x] === this.states.WALL ||
      this.board[newHead.y][newHead.x] === this.states.BODY
    ) {
      // Snake hit a wall or its own body, game over
      this.isGameOver = true;
      return; // Exit the function to prevent further execution
    }

    // Move the snake forward
    this.snake.push(newHead);
    this.board[newHead.y][newHead.x] = this.states.HEAD;

    // Update the snake body positions
    for (let i = 0; i < this.snake.length - 1; i++) {
      const { x, y } = this.snake[i];
      this.board[y][x] = this.states.BODY;
    }

    // Update the head reference
    this.head = newHead;
  };

  // Checks if the snake has won the game (filled the entire board)
  checkWin = () => {
    if (this.snakeSize === 50 * 50) {
      this.isGameOver = true;
    }
  };
}

export default SnakeController;

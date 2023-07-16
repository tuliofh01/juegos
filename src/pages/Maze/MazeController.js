class MazeController {
  constructor(width, height) {
    this.maze = this.generateMaze(width, height);

    this.states = {
      PATH: 0,
      WALL: 1,
      PLAYER: 2,
      FINAL: 3,
    };

    this.playerPosition = [0, 0];
    this.setPlayerPosition(1, 1);

    this.isGameOver = false;
  }

  generateMaze = (width, height) => {
    // Increase the width and height to account for the border
    const mazeWidth = width * 2 + 1;
    const mazeHeight = height * 2 + 1;
    // Create a 2D matrix filled with walls (1s)
    const maze = Array.from({ length: mazeHeight }, () =>
      Array.from({ length: mazeWidth }, () => 1)
    );
    // Helper function to check if a cell is within the maze boundaries
    function isWithinBounds(row, col) {
      return row >= 0 && row < mazeHeight && col >= 0 && col < mazeWidth;
    }
    // Recursive backtracking function to generate the maze
    function backtrack(row, col) {
      // Set the current cell as a path (0)
      maze[row][col] = 0;
      // Define the possible directions to move in the maze
      const directions = [
        [0, 2],
        [2, 0],
        [0, -2],
        [-2, 0],
      ];
      // Randomly shuffle the directions array
      directions.sort(() => Math.random() - 0.5);
      // Iterate through the shuffled directions
      for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (isWithinBounds(newRow, newCol) && maze[newRow][newCol] === 1) {
          // Set the cell between the current and new cell as a path (0)
          maze[row + dx / 2][col + dy / 2] = 0;
          // Recursively call backtrack for the new cell
          backtrack(newRow, newCol);
        }
      }
    }
    // Start the generation from the second row and second column
    const startRow = 1;
    const startCol = 1;
    backtrack(startRow, startCol);
    // Set a random exit in the last row
    const exitCol = Math.floor(Math.random() * width) * 2 + 1;
    maze[mazeHeight - 2][exitCol] = 3;
    this.finalPosition = [mazeHeight - 2, exitCol];

    return maze;
  };

  setPlayerPosition = (x, y) => {
    const [prevX, prevY] = this.playerPosition;

    if (
      prevX >= 0 &&
      prevX < this.maze.length &&
      prevY >= 0 &&
      prevY < this.maze[0].length
    ) {
      this.maze[prevX][prevY] = this.states.PATH;
    }

    if (
      x >= 0 &&
      x < this.maze.length &&
      y >= 0 &&
      y < this.maze[0].length &&
      this.maze[x][y] !== this.states.WALL
    ) {
      this.playerPosition = [x, y];
    }

    const [newX, newY] = this.playerPosition;
    this.maze[newX][newY] = this.states.PLAYER;

    this.checkGameStatus();
  };

  checkGameStatus = () => {
    const [playerX, playerY] = this.playerPosition;
    const [finalX, finalY] = this.finalPosition;

    if (playerX === finalX && playerY === finalY) {
      this.isGameOver = true;
    }
  };
}

export default MazeController;

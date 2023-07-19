class MemoryGameController {

    constructor(){
        // Defines board proprieties
        this.rows = 6;
        this.columns = 6;

        // Cell states
        this.states = {
            COVERED: 0,
            UNCOVERED: 1,
            CORRECT: 3
        };

        // Create state matrix
        this.stateMatrix = [];
        for (let i = 0; i < this.rows; i++) {
          const row = [];
          for (let j = 0; j < this.columns; j++) {
            row.push(this.states.COVERED);
          }
          this.stateMatrix.push(row);
        }

        // Creates board (2d matrix)
        this.board = [];
        for(let i = 0; i < this.rows; i++){
            const row = [];
            for(let j = 0; j < this.columns; j++){
                row.push(null);
            }
            this.board.push(row);
        }

        // Selects random numbers to be used as pairs in the game
        const selectedNumbers = [];
        for (let row = 0; row < this.rows; row++) {
          for (let column = 0; column < this.columns / 2; column++) {
            let randomNumber = Math.trunc(Math.random() * 40);
            while (selectedNumbers.find((number) => number === randomNumber)) {
              randomNumber = Math.trunc(Math.random() * 40);
            }
            selectedNumbers.push(randomNumber);
          }
        }

        // Creates and shuffles pairs array
        let pairs = selectedNumbers.flatMap((number) => [number, number]);
        function shuffleArray(array) {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        }
        pairs = shuffleArray(pairs);

        // Populates board with shuffled array
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columns; j++){
                this.board[i][j] = pairs.pop();
            }
        }

        // Stores game score
        this.score = 0;

        // Stores game status
        this.isGameOver = false;
    }

    // Compares 2 cells in the memory game and updates the score according to their equality
    guess = (cell1, cell2) => {
        if(this.board[cell1.x][cell1.y] === this.board[cell2.x][cell2.y]){
            this.stateMatrix[cell1.x][cell1.y] = this.states.CORRECT;
            this.stateMatrix[cell2.x][cell2.y] = this.states.CORRECT;
            this.score += 1;
        } else{
            if (this.score > 0){
                this.score -= 1;
            }
        }
    }

    // Checks if player has won and updates games' status
    checkWin = () => {
        let counter = 0;
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columns; j++){
                if(this.stateMatrix[i][j] === this.states.CORRECT){
                    counter += 1;
                }
            }
        }
        console.log(counter);
        if(counter === this.rows * this.columns){
            this.isGameOver = true;
        }
    }
}

export default MemoryGameController;
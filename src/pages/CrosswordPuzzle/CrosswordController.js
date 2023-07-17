import axios from "axios";
import Wordlist from "./assets/wordlist.txt";

class CrosswordController {
  constructor(boardSize, wordAmount) {
    // These arrays will fill the crossword matrix and its helper widget.
    this.words = []; this.definitions = []; 
    this.horizontalDefinitions = []; this.verticalDefinitions = [];

    // Determines game status.
    this.isGameOver = false;

    // Defines blank crossword matrix based on the 'size' parameter.
    this.crosswordMatrix = new Array(boardSize / 2)
      .fill(null)
      .map(() => new Array(boardSize).fill("_"));

    // Defines blank state matrix based on the 'size' parameter (will be used in game logic).
    this.stateMatrix = new Array(boardSize / 2);
    for (let i = 0; i < boardSize; i++) {
      this.stateMatrix[i] = new Array(boardSize);
    }

    // Defines superscripts for every input field
    this.superscriptMatrix = new Array(boardSize / 2);
    for (let i = 0; i < boardSize; i++) {
      this.superscriptMatrix[i] = new Array(boardSize);
    }

    // Determines possible states to be assumed by a state matrix cell.
    this.states = {
      BLANK: 0,
      FILLED: 1,
      INCORRECT: 2,
      CORRECT: 3,
    };

    // Gets game variables
    this.boardSize = boardSize;
    this.wordAmount = wordAmount;
  }

  getRandomWord = async () => {
    const randomLine = Math.trunc(Math.random() * 10000);

    try {
      const response = await axios.get(Wordlist);
      const fileData = response.data;
      const lines = fileData.split("\n");
      return lines[randomLine];
    } catch (error) {
      console.error("Error reading file:", error.message);
      // Handle the error gracefully
      return null;
    }
  };

  getWordDefinition = async (word) => {
    try {
      // Gets dictionary API response
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );

      const responseData = response.data;

      if (Array.isArray(responseData) && responseData.length > 0) {
        const firstDefinition =
          responseData[0].meanings[0].definitions[0].definition;
        return firstDefinition;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  // Populates word arrays and calls methods for populating the games' matrixes.
  populateArrays = async () => {
    // Defines horizontal and vertical words randomly.
    let counter = 0;
    while (counter < this.wordAmount) {      
      let randomWord = await this.getRandomWord();
      let wordDefinition = await this.getWordDefinition(randomWord);

      if (randomWord && wordDefinition) {
        if (!this.words.includes(randomWord)) {
          this.words.push(randomWord);
          this.definitions.push(wordDefinition);
          counter++;
        }
      } else {
        continue; // Restart the loop to recalculate randomWord and wordDefinition
      }
    }
    this.populateCrossword();
    this.populateStateMatrix();
  };

  populateStateMatrix = () => {
    for (let row = 0; row < this.boardSize / 2; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (
          this.crosswordMatrix[row][col] &&
          this.crosswordMatrix[row][col] !== "_"
        ) {
          this.stateMatrix[row][col] = this.states.FILLED;
        } else if (this.crosswordMatrix[row][col] === "_") {
          this.stateMatrix[row][col] = this.states.BLANK;
        } else {
          this.stateMatrix[row][col] = this.states.BLANK;
        }
      }
    }
  };

  populateCrossword = () => {
    const matrix = this.crosswordMatrix;
    const words = this.words;

    const verticalDefinitions = [];
    const horizontalDefinitions = [];
    let definitions = this.definitions;
    const superscriptMatrix = this.superscriptMatrix;

    const wordToDefinitionMap = {};
    // Populate the mapping object with word-definition pairs
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const oldIndex = words.indexOf(word);
      wordToDefinitionMap[word] = definitions[oldIndex];
    }
    words.sort((a, b) => b.length - a.length);
    // Create a new array to store the sorted definitions
    const sortedDefinitions = [];
    // Retrieve the sorted definitions based on the new order of words
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      sortedDefinitions[i] = wordToDefinitionMap[word];
    }
    // Update definitions with the sorted definitions
    definitions = sortedDefinitions;
    this.definitions = sortedDefinitions;

    const rows = matrix.length;
    const cols = matrix[0].length;

    function isValidPosition(word, row, col, direction) {
      if (direction === "horizontal") {
        if (col + word.length > cols) {
          return false; // Word exceeds the boundaries of the matrix
        }

        for (let i = 0; i < word.length; i++) {
          if (
            col + i >= cols ||
            (matrix[row][col + i] !== "_" && matrix[row][col + i] !== word[i])
          ) {
            return false; // Invalid position or conflicting letters
          }
          if (row > 0 && matrix[row - 1][col + i] !== "_") {
            return false; // Adjacent word on the same line above
          }
          if (row < rows - 1 && matrix[row + 1][col + i] !== "_") {
            return false; // Adjacent word on the same line below
          }
          if (
            i === 0 &&
            matrix[row][col + i] !== "_" &&
            matrix[row][col + i] !== word[i]
          ) {
            return false; // Intercepts previous word without sharing the same first letter cell
          }
        }
      } else {
        // direction === 'vertical'
        if (row + word.length > rows) {
          return false; // Word exceeds the boundaries of the matrix
        }

        for (let i = 0; i < word.length; i++) {
          if (
            row + i >= rows ||
            (matrix[row + i][col] !== "_" && matrix[row + i][col] !== word[i])
          ) {
            return false; // Invalid position or conflicting letters
          }
          if (col > 0 && matrix[row + i][col - 1] !== "_") {
            return false; // Adjacent word on the same line to the left
          }
          if (col < cols - 1 && matrix[row + i][col + 1] !== "_") {
            return false; // Adjacent word on the same line to the right
          }
          if (
            i === 0 &&
            matrix[row + i][col] !== "_" &&
            matrix[row + i][col] !== word[i]
          ) {
            return false; // Intercepts previous word without sharing the same first letter cell
          }
        }
      }

      return true; // Valid position
    }

    function placeWord(word, row, col, direction) {
      if (direction === "horizontal") {
        for (let i = 0; i < word.length; i++) {
          matrix[row][col + i] = word[i];
          superscriptMatrix[row][col + i] = words.indexOf(word);
        }
        horizontalDefinitions.push(
          superscriptMatrix[row][col] +
            " - " +
            definitions[words.indexOf(word)]
        );
      } else {
        // direction === 'vertical'
        for (let i = 0; i < word.length; i++) {
          matrix[row + i][col] = word[i];
          superscriptMatrix[row + i][col] = words.indexOf(word);
        }
        verticalDefinitions.push(
          superscriptMatrix[row][col] +
          " - " +
          definitions[words.indexOf(word)]
        );
      }
    }

    function removeWord(word, row, col, direction) {
      if (direction === "horizontal") {
        for (let i = 0; i < word.length; i++) {
          matrix[row][col + i] = "_";
        }
        horizontalDefinitions.pop();
      } else {
        // direction === 'vertical'
        for (let i = 0; i < word.length; i++) {
          matrix[row + i][col] = "_";
        }
        verticalDefinitions.pop();
      }
    }

    function backtrack(index, direction) {
      if (index >= words.length) {
        return true; // All words are placed successfully
      }

      const word = words[index];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (isValidPosition(word, row, col, direction)) {
            placeWord(word, row, col, direction);

            const nextDirection =
              direction === "horizontal" ? "vertical" : "horizontal";
            if (backtrack(index + 1, nextDirection)) {
              return true;
            }

            removeWord(word, row, col, direction);
          }
        }
      }

      return false; // No valid position found for the word
    }

    backtrack(0);

    this.crosswordMatrix = matrix;
    this.horizontalDefinitions = horizontalDefinitions;
    this.verticalDefinitions = verticalDefinitions;
    this.superscriptMatrix = superscriptMatrix;
  };

  countLetters = () => {
    let letters = 0;
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (
          this.stateMatrix[i][j] === this.states.FILLED
        ) {
          letters += 1;
        }
      }
    }
    return letters;
  }

  countFlaws = () => {
    let flaws = 0;
    for(let i = 0; i < this.boardSize; i++){
      for(let j = 0; j < this.boardSize; j++){
        if (
          this.stateMatrix[i][j] === this.states.BLANK ||
          this.stateMatrix[i][j] === this.states.INCORRECT ||
          this.stateMatrix[i][j] === this.states.FILLED
        ) {
          flaws += 1;
        }
      }
    }
    return flaws;
  }

  checkGameStatus = () => {
    if(this.countFlaws() === 0){
      this.isGameOver = true;
    }
  }
}

export default CrosswordController;

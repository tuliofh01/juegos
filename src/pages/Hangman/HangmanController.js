import axios from "axios";
import Wordlist from "./assets/wordlist.txt"

class HangmanController {
  constructor(){
    this.word = ""

    this.states = {
      BLANK: 1,
      WRONG: 2,
      RIGHT: 3
    }
    this.score = 0;

    this.lives = 8;

    this.isGameOver = false;
  }

  setArrays = async () => {
    const randomLine = Math.trunc(Math.random() * 10000);
    try {
      const response = await axios.get(Wordlist);
      const fileData = response.data;
      const lines = fileData.split("\n");
      this.word = lines[randomLine];
      
      this.wordArray = [];
      for (let i = 0; i < this.word.length; i++) {
        this.wordArray.push(this.word[i]);
      }

      this.inputArray = new Array(this.word.length);
      for (let i = 0; i < this.word.length; i++) {
        this.inputArray[i] = '';
      }

      this.statesArray = new Array(this.word.length);
      for (let i = 0; i < this.word.length; i++) {
        this.statesArray[i] = this.states.BLANK;
      }

      console.log(this.word);
    } catch (error) {
      console.error("Error reading file:", error.message);
      // Handle the error gracefully
      return null;
    }
  };

  countFlaws = () => {
    let flaws = 0;
    for(let i = 0; i < this.word.length; i++){
      if(this.statesArray[i] !== this.states.RIGHT){
        flaws += 1
      }
    }
    return flaws;
  }

  compareLetters = (letter, index) => {
    if(this.wordArray[index] === letter){
      return true;
    } else {
      return false;
    }
  }

  changeStates = (input, index) => {
    if(input === ""){
      this.statesArray[index] = this.states.BLANK
    } else if (this.compareLetters(input, index)){
      this.statesArray[index] = this.states.RIGHT;
    } else {
      this.statesArray[index] = this.states.WRONG;
    }
  }

  setInput = (index, letter) => {
    this.inputArray[index] = letter
    if(!this.compareLetters(letter, index)){
      this.lives -= 1;
    } else {
      this.score += 1;
      const sameLetterIndexes = [];
      for(let i = 0; i < this.wordArray.length; i++){
        if(letter === this.wordArray[i]){
          sameLetterIndexes.push(i);
        }
      }
      for(const i of sameLetterIndexes){
        this.statesArray[i] = this.states.RIGHT;
        this.inputArray[i] = this.wordArray[i];
      }
    }
  }

  checkGameStatus = () => {
    if (this.lives === 1 || this.countFlaws() === 0){
        this.isGameOver = true;
    }
  };
}

export default HangmanController;
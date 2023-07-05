class GuessTheNumberController{

    constructor(){
        this.drawnNumber = Math.trunc(Math.random() * 80) + 1;
        this.lives = 8;
        
        this.isGameOver = false;
        this.victory = false;

        this.states = {
            TOO_LOW: 0,
            TOO_HIGH: 1,
            EXACT: 2,
            UNTOUCHED: 3
        };
        this.currentState = this.states.UNTOUCHED;
    }

    guess = (number) => {
        if (number > this.drawnNumber){
            this.lives -= 1;
            this.currentState = this.states.TOO_HIGH;
        } else if (number < this.drawnNumber){
            this.lives -= 1;
            this.currentState = this.states.TOO_LOW;
        } else {
            this.currentState = this.states.EXACT;
        }
        this.setGameStatus();
    }

    setGameStatus = () => {
        if (this.lives === 0){
            this.isGameOver = true;
        } else if (this.currentState === this.states.EXACT){
            this.isGameOver = true;
            this.victory = true;
        }
    }
}

export default GuessTheNumberController;
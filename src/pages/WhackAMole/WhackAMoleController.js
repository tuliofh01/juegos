class WhackAMoleController{

    constructor(rows, columns){
        this.rows = rows;
        this.columns = columns;
        
        this.score = 0;

        this.states = {
            EMPTY: 0,
            FILLED: 1
        };

        this.board = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < columns; j++) {
                row.push(this.states.EMPTY);
            }
            this.board.push(row);
        }
    }

    iterate = () => {
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.rows; j++){
                const moleProbability = Math.trunc(100 * Math.random());
                if (moleProbability > 85){
                    this.board[i][j] = this.states.FILLED;
                } else {
                    this.board[i][j] = this.states.EMPTY;
                }
            }
        }
    };
}

export default WhackAMoleController;
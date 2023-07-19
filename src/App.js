import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index/Index";
import MinefieldView from "./pages/Minefield/MinefieldView";
import GuessTheNumberView from "./pages/GuessTheNumber/GuessTheNumberView";
import CrosswordView from "./pages/CrosswordPuzzle/CrosswordView";
import WhackAMoleView from "./pages/WhackAMole/WhackAMoleView";
import MemoryGameView from "./pages/MemoryGame/MemoryGameView";
import TicTacToeView from "./pages/TicTacToe/TicTacToeView";
import HangmanView from "./pages/Hangman/HangmanView";
import SnakeView from "./pages/Snake/SnakeView";
import MazeView from "./pages/Maze/MazeView";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" Component={Index} />
          <Route path="/minefield" Component={MinefieldView} />
          <Route path="/guessTheNumber" Component={GuessTheNumberView} />
          <Route path="/crosswordPuzzle" Component={CrosswordView} />
          <Route path="/hangman" Component={HangmanView} />
          <Route path="/maze" Component={MazeView} />
          <Route path="/mole" Component={WhackAMoleView}/>
          <Route path="/hash" Component={TicTacToeView} />
          <Route path="/snake" Component={SnakeView} />
          <Route path="/memory" Component={MemoryGameView} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

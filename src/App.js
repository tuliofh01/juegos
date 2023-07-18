import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MinefieldView from "./pages/Minefield/MinefieldView";
import Index from "./pages/Index/Index"
import GuessTheNumberView from "./pages/GuessTheNumber/GuessTheNumberView";
import CrosswordView from "./pages/CrosswordPuzzle/CrosswordView";
import HangmanView from "./pages/Hangman/HangmanView";
import MazeView from "./pages/Maze/MazeView"
import WhackAMoleView from "./pages/WhackAMole/WhackAMoleView";
import TicTacToeView from "./pages/TicTacToe/TicTacToeView";

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
        </Routes>
      </Router>
    </div>
  );
}

export default App;

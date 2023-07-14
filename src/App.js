import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MinefieldView from "./pages/Minefield/MinefieldView";
import Index from "./pages/Index/Index"
import GuessTheNumberView from "./pages/GuessTheNumber/GuessTheNumberView";
import CrosswordView from "./pages/CrosswordPuzzle/CrosswordView";
import HangmanView from "./pages/Hangman/HangmanView";

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
        </Routes>
      </Router>
    </div>
  );
}

export default App;

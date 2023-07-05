import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MinefieldView from "./pages/Minefield/MinefieldView";
import Index from "./pages/Index/Index"
import GuessTheNumberView from "./pages/GuessTheNumber/GuessTheNumberView";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Index/>}/>
          <Route path="/minefield" element={<MinefieldView />} />
          <Route path="/guessTheNumber" element={<GuessTheNumberView/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

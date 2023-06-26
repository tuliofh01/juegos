import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MinefieldView from "./pages/Minefield/MinefieldView";
import Index from "./pages/Index/Index"

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Index/>}/>
          <Route path="/minefield" element={<MinefieldView />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

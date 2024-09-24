import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Messages from "./Pages/Messages";
import Communities from "./Pages/Communities";
import Intro from "./Pages/Intro";

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/profile" element={<Communities />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App

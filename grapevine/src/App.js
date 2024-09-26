import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Messages from "./Pages/Messages";
import Communities from "./Pages/Communities";
import Intro from "./Pages/Intro";
import Profile from "./Pages/Profile"

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App

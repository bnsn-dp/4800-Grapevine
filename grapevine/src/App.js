import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Messages from "./Pages/Messages";
import Profile from "./Pages/Profile";
import Intro from "./Pages/Intro";

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/welcome" element={<Intro />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App

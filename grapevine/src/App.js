import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App

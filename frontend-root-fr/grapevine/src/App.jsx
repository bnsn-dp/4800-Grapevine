import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Communities from "./pages/Communities";
import Profile from "./pages/Profile"
import IntroPage from './pages/Intro';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App